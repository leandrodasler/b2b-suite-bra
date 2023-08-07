# B2B Suite Brasil

Provides blocks and services for B2B stores.

## Configuration

Add the `ssesandbox04.b2b-suite-bra@1.x` app to your theme's dependencies in the `manifest.json`, for example:

```json
"dependencies": {
  "ssesandbox04.b2b-suite-bra": "1.x"
}
```

Now, you are able to use all blocks and services provided by `b2b-suite-bra` app.

#### Available blocks

| Block name                | Description                                                                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sku-list`                | Top level block in which you will declare as `children` the SKU List layout blocks according to devices (`sku-content.desktop` and the `sku-content.mobile` blocks). |
| `sku-content.desktop`     | Defines the SKU List layout for desktop devices.                                                                                                                     |
| `sku-content.mobile`      | Defines the SKU List layout for mobile devices.                                                                                                                      |
| `sku-name`                | Renders the SKU name.                                                                                                                                                |
| `sku-image`               | Renders the SKU image.                                                                                                                                               |
| `sku-seller`              | Renders the SKU sellers (if it has any). It uses the `seller-name`, `seller-inventory` and `seller-price` blocks as children in order to display seller data.        |
| `seller-name`             | Renders the SKU seller name.                                                                                                                                         |
| `seller-inventory`        | Renders the SKU inventory per seller.                                                                                                                                |
| `seller-price`            | Renders the SKU price per seller.                                                                                                                                    |
| `sku-price`               | Renders the SKU price.                                                                                                                                               |
| `sku-inventory`           | Renders the SKU inventory.                                                                                                                                           |
| `sku-quantity-selector`   | Renders a quantity selector.                                                                                                                                         |
| `item-quantity`           | Renders the SKU inventory.                                                                                                                                           |
| `sku-buy-button`          | Renders a Buy Button to add a given SKU to the minicart.                                                                                                             |
| `item-buy-button`         | Renders a Buy Button to add a given Product to the minicart.                                                                                                         |
| `sku-specifications`      | Renders the SKU specifications.                                                                                                                                      |
| `sku-highlights`          | Renders a highlight disclaimer for a specific SKU.                                                                                                                   |
| `add-all-to-cart-button`  | Renders a button to add all SKUs in the sku-list to the minicart.                                                                                                    |
| `b2b-context`             | Provides context information for B2B specific features.                                                                                                              |
| `b2b-last-orders`         | Renders a list of the B2B customer's last orders in a B2B context.                                                                                                   |
| `b2b-representative-area` | Renders the B2B representative area, where a B2B representative can view and manage customer information.                                                            |
| `skeleton`                | Custom skeleton for loading states                                                                                                                                   |
| `spinner`                 | Imported Spinner from [VTEX Styleguide](https://styleguide.vtex.com/) for loading states                                                                             |
| `sales-channel-banner`    | Slider of conditionally displayed banners according to the organization sales channel.                                                                               |

#### Available routes

| Route                                       | Description                                                    |
| ------------------------------------------- | -------------------------------------------------------------- |
| `/_v/private/b2b-suite-bra/monthly-orders`  | Provides monthly stats from user organization and cost center. |
| `/_v/private/b2b-suite-bra/orders`          | Lists orders from user organization.                           |
| `/_v/private/b2b-suite-bra/orders/:orderId` | Retrieves order from user organization given an order ID.      |
