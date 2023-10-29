import type { ApolloError } from 'apollo-client'
import type { ReactNodeArray } from 'react'
import type { InjectedIntl } from 'react-intl'
import type { ProductTypes } from 'vtex.product-context'
import type { Seller } from 'vtex.product-context/react/ProductTypes'

interface Benefit {
  teaserType?: string
  items?: Array<{
    minQuantity?: number
    discount?: number
  }>
}

export interface Product extends Partial<ProductTypes.Product> {
  productId: string
  description: string
  productName: string
  productReference: string
  linkText: string
  brand: string
  brandId: string
  items: ProductTypes.Item[]
  categories: string[]
  benefits?: Benefit[]
}

export interface Item extends Partial<ProductTypes.Item> {
  itemId: string
  name: string
  ean: string
  nameComplete: string
  complementName: string
  measurementUnit: string
  unitMultiplier: number
  images: Image[]
  sellers: Seller[]
  options?: BuyButtonItemOption[]
  variations: Variation[]
  quantity: number
}

export interface Variation {
  name: string
  values: string[]
}

export interface LineItem {
  sellingPriceWithAssemblies: number
  price: number
  quantity: number
}

export interface Image {
  imageId: string
  imageUrls?: string[]
  imageUrl: string
  thresholds?: number[]
  thumbnailUrl?: string
  imageText: string
  imageLabel: string
  imageTag: string
}

export interface CommercialOffer {
  Price: number
  ListPrice: number
  PriceWithoutDiscount: number
  RewardValue: number
  AvailableQuantity: number
  Installments: Installment[]
}

export interface Installment {
  Value: number
  InterestRate: number
  TotalValuePlusInterestRate: number
  NumberOfInstallments: number
  Name: string
}

export interface PriceBreaks {
  priceBreaks: PriceBreak[]
}

export interface PriceBreak {
  itemId: string
  maxQuantity: number
  minQuantity: number
  price: number
  leadTime: string
  totalScheduledTime: string
}

export interface PriceBreakResult {
  loading: boolean
  error?: ApolloError
  data: PriceBreaks
}

export interface MessageProps {
  showItemsPrice?: boolean
  skuItems: LineItem[]
}

export interface BuyButtonItemOption {
  id: string
  quantity: number
  assemblyId: string
  seller?: string
}

export interface InstalledApp {
  version: string
}

export interface CheckoutVersion {
  installedApp: InstalledApp
}

export type GroupId = string

export type InputValues = Record<string, string>

export interface AssemblyOptionItem {
  id: string
  quantity: number
  seller: string
  initialQuantity: number
  choiceType: GroupTypes
  name: string
  price: number
  children: Record<string, AssemblyOptionItem[]> | null
}

export interface AssemblyOptions {
  items: Record<GroupId, AssemblyOptionItem[]>
  inputValues: Record<GroupId, InputValues>
  areGroupsValid: Record<GroupId, boolean>
}

export type Option = ItemOption | InputValuesOption

export interface ItemOption {
  assemblyId: string
  id: string
  quantity: number
  seller: string
  options?: Option[]
}

export type InputValue = Record<string, string | boolean>

export interface InputValuesOption {
  assemblyId: string
  inputValues: InputValue
}

export interface AddedItem {
  id: string
  name: string
  quantity: number
  sellingPrice: number
  sellingPriceWithAssemblies: number
  assemblyOptions?: ParsedAssemblyOptionsMeta
}

export type GroupTypes = 'SINGLE' | 'TOGGLE' | 'MULTIPLE'

export interface CartAddedOption {
  normalizedQuantity: number
  extraQuantity: number
  choiceType: GroupTypes
  item: AddedItem
}

export interface CartRemovedOption {
  name: string
  initialQuantity: number
  removedQuantity: number
}

export interface ParsedAssemblyOptionsMeta {
  added: CartAddedOption[]
  removed: CartRemovedOption[]
  parentPrice: number
}

export interface ParsedAssemblyOptions {
  options: Option[]
  assemblyOptions: ParsedAssemblyOptionsMeta
}

export interface BuyButtonItem {
  skuId: string
  quantity: number
  seller?: string | number
  name?: string
  price?: number
  variant?: string
  brand?: string
  options: BuyButtonItemOption[]
}

export interface CartItem {
  index: number
  quantity: number
  detailUrl: string
  name: string
  brand: string
  category: string
  productRefId: string
  seller: string | number
  price: number
  listPrice: number
  variant: string
  skuId: string
  imageUrl: string
  options: Option[]
  assemblyOptions: ParsedAssemblyOptionsMeta
  sellingPriceWithAssemblies: number
}

export interface MiniCartItem {
  quantity: number
  detailUrl: string
  name: string
  brand: string
  category: string
  productRefId: string
  seller: string | number
  sellingPrice: number
  listPrice: number
  skuName: string
  id: string
  imageUrl: string
  options: Option[]
  assemblyOptions: ParsedAssemblyOptionsMeta
  sellingPriceWithAssemblies: number
}

export interface SkuSelector {
  isVisible: boolean
  areAllVariationsSelected: boolean
}

export interface CustomApp {
  id?: string
  fields?: any
}

export interface Address {
  addressName?: string
  addressType?: string
  city?: string
  complement?: string
  country?: string
  id?: string
  neighborhood?: string
  number?: string
  postalCode?: string
  receiverName?: string
  reference?: string
  state?: string
  street?: string
  userId?: string
}

export interface AddItemResponse {
  data: {
    addItem: {
      items: Array<{
        id: string
        seller: string | number
      }>
    }
  }
}

export interface OrderFormContext {
  message: {
    isSuccess?: boolean
    message?: string
  }
  loading: boolean
  refetch: () => Promise<void>
  addItem: ({ variables }: { variables: OrderFormArgs }) => AddItemResponse
  updateOrderForm: () => void
  updateOrderFormProfile: () => void
  updateAndRefetchOrderForm: () => void
  updateToastMessage: () => void
  updateOrderFormShipping: () => void
  orderForm: OrderFormArgs
}

export interface TooltipArgs {
  showTooltipOnSkuNotSelected: boolean
  skuSelector: SkuSelector
  orderFormContext: OrderFormContext
}

export interface BuyButtonWrapperProps {
  intl: InjectedIntl
  addToCart: (items: MiniCartItem[]) => AddToCartResponse
  showToast?: () => void
  onAddStart?: () => void
  onAddFinish?: () => void
  children: ReactNodeArray
  isOneClickBuy?: boolean
  shouldOpenMinicart?: boolean
  setMinicartOpen: () => void
  showItemsPrice?: boolean
  available?: boolean
  skuItems: CartItem[]
  large: boolean
  disabled?: boolean
  shouldAddToCart?: boolean
  customToastURL?: string
  showTooltipOnSkuNotSelected?: boolean
  checkoutVersion?: CheckoutVersion
}

export interface AddToCartResponse {
  data: {
    addToCart: Array<{
      id: string
      seller: string | number
    }>
  }
}

export interface BuyButtonProps {
  intl: InjectedIntl
  large: boolean
  // addToCart: (items: MiniCartItem[]) => AddToCartResponse
  addToCart: any
  skuItems: CartItem[]
  onAddStart?: () => void
  onAddFinish?: () => void
  // setMinicartOpen: (open: true) => void
  setMinicartOpen: any
  available?: boolean
  orderFormContext: OrderFormContext
  isOneClickBuy?: boolean
  children: ReactNodeArray
  disabled?: boolean
  shouldAddToCart?: boolean
  shouldOpenMinicart?: boolean
  showTooltipOnSkuNotSelected?: boolean
  checkoutUrl?: string
  customToastURL?: string
  showToast?: () => void
}

export interface ToastMessageArgs {
  success: boolean
  isNewItem?: boolean
}

export interface OrderFormArgs {
  orderFormId?: string
  value?: number
  items: Array<{
    id: string
    seller: string | number
    options: Option[]
    quantity: number
  }>
  customData: {
    customApps: CustomApp[]
  }
  shippingData: {
    address: Address
    availableAddresses: any[]
  }
}

// eslint-disable-next-line no-restricted-syntax
export enum InitialSelectionType {
  complete = 'complete',
  image = 'image',
  empty = 'empty',
}

// eslint-disable-next-line no-restricted-syntax
export enum DisplayMode {
  select = 'select',
  default = 'default',
}

export type Variations = Record<string, string[]>

export type Maybe<T> = T | null | undefined

export interface BuyButtonContextState {
  clicked: boolean
}

export interface ProductContextState {
  selectedItem: Maybe<Item>
  product: Maybe<Product>
  selectedQuantity: number
  skuSelector: {
    isVisible: boolean
    areAllVariationsSelected: boolean
  }
  buyButton: BuyButtonContextState
  assemblyOptions: {
    items: Record<string, AssemblyOptionItem[]>
    inputValues: Record<string, InputValues>
    areGroupsValid: Record<string, boolean>
  }
}

export interface AssemblyOptionInput {
  id?: string
  quantity?: number
  assemblyId: string
  seller?: string
  inputValues?: Record<string, string | boolean>
  options?: AssemblyOptionInput[]
}

export interface OrderFormItemInput {
  id?: number
  index?: number
  quantity?: number
  seller?: string
  uniqueId?: string
  options?: AssemblyOptionInput[]
}

export type ConditionProps = {
  Then?: React.ComponentType
  Else?: React.ComponentType
}
