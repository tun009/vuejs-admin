<script setup lang="ts">
import { RuleModel } from '@/@types/pages/rules'
import { ElInput } from 'element-plus'
import { computed } from 'vue'
import { defineProps, onMounted, ref } from 'vue'

// Define props for suggestions (array of { key: string, value: string }) and prefix (string)
interface Props {
  suggestions?: { id: number; code: string; value: string }[]
  prefix?: string
  isSingleLine?: boolean
  defaultValue?: string
  modelValue: string
  index: number
}
const props = withDefaults(defineProps<Props>(), {
  suggestions: () => [],
  prefix: '',
  isSingleLine: true,
  defaultValue: '',
  modelValue: ''
})

interface Emits {
  (event: 'update:model-value', value: string): void
  (event: 'update-value', value: { index: number; value: Partial<RuleModel> }): void
}

const emits = defineEmits<Emits>()
const updateValue = (value: string) => {
  emits('update:model-value', value)
}
const inputElement = ref<InstanceType<typeof ElInput> | null>(null)
const textareaWrapperRef = ref(null)
// Reactive state for text area content and suggestions
// const inputValue = ref<string>(props.defaultValue ?? props.prefix)
const filteredSuggestions = ref<{ id: number; code: string; value: string }[]>([])
const showSuggestions = ref<boolean>(true)
// const rows = ref<number>(props.isSingleLine ? 1 : 4) // Set initial number of rows in textarea
const activeSuggestionIndex = ref<number>(-1) // Index of the selected suggestion
const currentLineIndex = ref<number>(-1) // Index of the current line user is editing

// Stores the key of selected suggestions for each line
const selectedKeys = ref<(number | undefined)[]>([])

// Stores the corresponding line data
// const lineData = ref<{ key: string | undefined; value: string }[]>([])

// Handle input change event and filter suggestions based on the current line
const onInputChange = (value: string) => {
  const lines = getLines(value)
  if (currentLineIndex.value !== -1) {
    const currentLine = lines[currentLineIndex.value]
    const discrepancyPart = extractDiscrepancyPart(currentLine)

    if (discrepancyPart) {
      // Filter suggestions based on what follows props.prefix in the current line
      filteredSuggestions.value = props.suggestions.filter((suggestion) =>
        suggestion.value.toLowerCase().includes(discrepancyPart.toLowerCase())
      )
      showSuggestions.value = true
    } else {
      showSuggestions.value = false
    }
  }
}

// Get all lines from the input value
const getLines = (value?: string): string[] => {
  return (value ?? localModelValue.value).split('\n')
}

// Extract the part after props.prefix in the given line
const extractDiscrepancyPart = (line: string): string => {
  const discrepancyIndex = line?.indexOf(props.prefix)
  if (discrepancyIndex === -1) return '' // Return empty if props.prefix is not found
  return line.slice(discrepancyIndex + props.prefix.length).trim() // Return text after props.prefix
}

// Highlight the matched part of the suggestion
const highlightText = (text: string): string => {
  const lines = getLines()
  const currentLine = lines[currentLineIndex.value]
  const discrepancyPart = extractDiscrepancyPart(currentLine)

  if (discrepancyPart) {
    const regex = new RegExp(`(${discrepancyPart})`, 'gi') // Regex to match the discrepancy part
    return text.replace(regex, "<span class='highlight'>$1</span>") // Wrap the match in a <span> with class 'highlight'
  }
  return text
}

// Handle key down events to navigate the suggestions
const onKeyDown = (event: any) => {
  if (showSuggestions.value) {
    // Prevent the cursor from moving up/down in the textarea
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
    }

    if (event.key === 'ArrowDown') {
      // Move to the next suggestion
      activeSuggestionIndex.value = Math.min(activeSuggestionIndex.value + 1, filteredSuggestions.value.length - 1)
      handleScrollSuggestion()
    } else if (event.key === 'ArrowUp') {
      // Move to the previous suggestion
      activeSuggestionIndex.value = Math.max(activeSuggestionIndex.value - 1, 0)
      handleScrollSuggestion(true)
    } else if (event.key === 'Enter' && activeSuggestionIndex.value !== -1) {
      // Select the current active suggestion
      onSelectSuggestion(filteredSuggestions.value[activeSuggestionIndex.value])
    }
  }
}

// Handle selection of a suggestion
const onSelectSuggestion = (suggestion: { id: number; value: string; code: string }) => {
  const lines = getLines()
  const line = lines[currentLineIndex.value]
  const discrepancyPart = extractDiscrepancyPart(line)

  if (discrepancyPart) {
    // Replace the part after props.prefix with the selected suggestion
    lines[currentLineIndex.value] = line.slice(0, line.indexOf(props.prefix) + props.prefix.length) + suggestion.value
    // inputValue.value = lines.join('\n') // Update the textarea value
    updateValue(lines.join('\n'))
    selectedKeys.value[currentLineIndex.value] = suggestion.id // Store the key for this line
    showSuggestions.value = false // Hide suggestions after selection

    // Move cursor to the end of the current line after the update
    emits('update-value', {
      index: props.index,
      value: { id: suggestion.id, code: suggestion.code, defaultValue: suggestion.value }
    })
    setCursorToEnd()
  }
}

// Move cursor to the end of the current line after suggestion selection
const setCursorToEnd = () => {
  const textarea = inputElement.value?.textarea as HTMLTextAreaElement
  const lines = getLines()
  const currentLine = lines[currentLineIndex.value]
  const newPosition = props.modelValue.indexOf(currentLine) + currentLine.length
  textarea.selectionStart = newPosition
  textarea.selectionEnd = newPosition
}

// Submit function to generate the required data
// const onSubmit = () => {
//   const lines = getLines()
//   lineData.value = lines.map((line, index) => {
//     const selectedKey = selectedKeys.value[index]
//     return {
//       key: selectedKey || undefined, // If a suggestion was selected, we use its key or undefined if modified
//       value: line.slice(line.indexOf(props.prefix) + props.prefix.length).trim() || ''
//     }
//   })
// }

const handleScrollSuggestion = (up?: boolean) => {
  try {
    // Select the parent and child elements
    const parent = document.getElementById('autocomplete-dropdown')
    const child = document.getElementById('_suggestion-active')

    // Scroll the parent to the position of the child
    if (!parent || !child) return
    parent.scrollTop = up ? child.offsetTop - 75 : child.offsetTop
  } catch (error) {
    console.error(error)
  }
}

// Handle the Enter key press (new line at the end of content)
const onEnter = () => {
  const textarea = inputElement.value?.textarea as HTMLTextAreaElement
  const cursorPosition = textarea?.selectionStart // Get the cursor position

  // Only allow new line if the cursor is at the end of the content
  if (cursorPosition === props.modelValue.length) {
    const lines = getLines()
    const lastLineIndex = lines.length - 1
    const lastLine = lines[lastLineIndex]

    const discrepancyPart = extractDiscrepancyPart(lastLine)

    if (discrepancyPart && activeSuggestionIndex.value !== -1) {
      const suggestion = filteredSuggestions.value[activeSuggestionIndex.value]

      // Keep props.prefix and replace the part after it
      lines[lastLineIndex] = lastLine.slice(0, lastLine.indexOf(props.prefix) + props.prefix.length) + suggestion.value

      updateValue(lines.join('\n'))

      showSuggestions.value = false // Hide dropdown after selection
      activeSuggestionIndex.value = -1 // Reset active suggestion

      emits('update-value', {
        index: props.index,
        value: { id: suggestion.id, code: suggestion.code, defaultValue: suggestion.value }
      })
      setCursorToEnd()
    } else {
      if (props.isSingleLine) return
      currentLineIndex.value++
      // If no props.prefix, just add a new line
      updateValue(props.modelValue + '\n' + props.prefix)

      // Reset filteredSuggestions to default
      filteredSuggestions.value = [...props.suggestions]
      showSuggestions.value = false
    }
  }
}

// Update the current line index when user clicks or types
const updateCurrentLineIndex = () => {
  const textarea = inputElement.value?.textarea as HTMLTextAreaElement
  const cursorPosition = textarea.selectionStart

  const lines = getLines()
  let lineLength = 0

  // Find the current line based on cursor position
  for (let i = 0; i < lines.length; i++) {
    lineLength += lines[i].length + 1 // Account for line break
    if (cursorPosition <= lineLength) {
      currentLineIndex.value = i
      break
    }
  }
}

const handleClickOutside = () => {
  showSuggestions.value = false
}

// Update current line index on text input or focus
onMounted(() => {
  const textarea = inputElement.value?.textarea as HTMLTextAreaElement
  textarea?.addEventListener('focus', updateCurrentLineIndex)
  textarea?.addEventListener('input', updateCurrentLineIndex)
})

const localModelValue = computed({
  get() {
    return props.modelValue
  },
  set(newValue) {
    emits('update:model-value', newValue)
  }
})
</script>

<template>
  <div class="autocomplete-wrapper w-full" ref="textareaWrapperRef">
    <!-- Textarea input with Enter handler -->
    <el-input
      type="textarea"
      v-model="localModelValue"
      placeholder="Typing to search..."
      :autosize="{ maxRows: 4, minRows: 1 }"
      @keydown.enter.prevent="onEnter"
      @input="onInputChange"
      ref="inputElement"
      @keydown="onKeyDown"
      resize="none"
      class="w-full custom-textarea"
    />

    <!-- Autocomplete suggestions (dropdown) -->
    <div
      v-if="showSuggestions && filteredSuggestions.length > 0"
      id="autocomplete-dropdown"
      class="autocomplete-dropdown"
      v-click-outside="handleClickOutside"
    >
      <ul>
        <li
          v-for="(suggestion, index) in filteredSuggestions"
          :key="suggestion.id"
          :id="activeSuggestionIndex === index ? '_suggestion-active' : ''"
          :class="{ active: activeSuggestionIndex === index }"
          @click="onSelectSuggestion(suggestion)"
          v-html="highlightText(suggestion.value)"
        />
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.autocomplete-dropdown {
  @extend %scrollbar;
}
/* Style for the autocomplete dropdown */
.autocomplete-wrapper {
  position: relative;
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-top: none;
  max-height: 150px;
  overflow-y: auto;
  z-index: 100;
  border-radius: 8px;
}

.autocomplete-dropdown ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.autocomplete-dropdown li {
  padding: 8px;
  cursor: pointer;
}

.autocomplete-dropdown li:hover {
  background-color: #f5f5f5;
}

.autocomplete-dropdown li.active {
  background-color: #e0e0e0;
}
</style>

<style lang="css">
/* Highlight matching part of the suggestion */
.highlight {
  background-color: yellow;
  font-weight: bold;
}

.el-textarea__inner {
  min-height: 40px !important; /* Set the minimum height as per your requirement */
}
</style>
