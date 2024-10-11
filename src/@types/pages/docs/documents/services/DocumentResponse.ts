import { ApproveProcessDocumentModel, DocumentFileModel, DocumentModel, DocumentResultModel } from '..'

import { BaseListResponseModel } from '@/@types/common'

export type GetDocumentResponseModel = BaseListResponseModel<DocumentModel>

export type GetDocumentFileResponseModel = BaseListResponseModel<DocumentFileModel>

export type GetDocumentResultsResponseModel = BaseListResponseModel<DocumentResultModel>

export type GetCheckersResponseModel = BaseListResponseModel<ApproveProcessDocumentModel>
