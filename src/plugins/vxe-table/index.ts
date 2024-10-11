import { type App } from 'vue'
import VXETable from 'vxe-table'
import VXETablePluginElement from 'vxe-table-plugin-element'

VXETable.use(VXETablePluginElement)

/** Global default parameters */
VXETable.setConfig({
  /** Global size */
  size: 'medium',
  /** Global zIndex starting value. If the z-index style value of the project is too large, you need to set it larger to avoid being blocked */
  zIndex: 9999,
  /** Version number. It is useful for some functions with data cache. Increasing the version number can be used to reset the data */
  version: 0,
  /** Global loading prompt content. If it is null, no text is displayed */
  loadingText: null,
  table: {
    showHeader: true,
    showOverflow: 'tooltip',
    showHeaderOverflow: 'tooltip',
    autoResize: true,
    // stripe: false,
    border: 'inner',
    // round: false,
    emptyText: '暂无数据',
    rowConfig: {
      isHover: true,
      isCurrent: true,
      // Unique primary key field name of the row data
      keyField: '_VXE_ID'
    },
    columnConfig: {
      resizable: false
    },
    align: 'center',
    headerAlign: 'center'
  },
  pager: {
    // size: "medium",
    /** Matching styles */
    perfect: false,
    pageSize: 10,
    pagerCount: 7,
    pageSizes: [10, 20, 50],
    layouts: ['Total', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'Sizes', 'FullJump']
  },
  modal: {
    minWidth: 500,
    minHeight: 400,
    lockView: true,
    mask: true,
    // duration: 3000,
    // marginSize: 20,
    dblclickZoom: false,
    showTitleOverflow: true,
    transfer: true,
    draggable: false
  }
})

export function loadVxeTable(app: App) {
  /** Vxe Table component is fully introduced */
  app.use(VXETable)
}
