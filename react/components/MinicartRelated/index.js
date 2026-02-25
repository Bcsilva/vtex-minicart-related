/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import PropTypes from 'prop-types'
import { Spinner } from 'vtex.styleguide'

import ProductList from './render/ProductList'
import { QueryProducts } from './render/QueryProducts'
import { productListSchemaPropTypes } from '../../utils/propTypes'
import './MinicartRelated.global.css'

const MinicartRelated = ({
  productList,
  groupBy,
  recommendation,
  trackingId,
  hideOutOfStockItems,
  shelfTitle,
  slug,
}) => {
  const { orderForm } = useOrderForm() // Obtém o orderForm
  const [relatedContext, setRelatedContext] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let _relatedContent = null
    if (orderForm.items.length > 0) {
      // _relatedContent = orderForm.items[0].productId
      _relatedContent = orderForm.items[0]
      setLoading(false)
      console.log(JSON.stringify(ProductList))
      console.log(productList)
      // _relatedContent = orderForm.items.at(-1).productId
    }
    setRelatedContext(_relatedContent)
  }, [orderForm])

  return (
    <div
      className="MinicartRelated"
      data-slug={slug}
      data-items={orderForm.items.length}
    >
      {orderForm.items.length > 0 && relatedContext && (
        <>
          {loading === false ? (
            <QueryProducts
              productList={productList}
              productQuery={relatedContext}
              groupBy={groupBy}
              recommendation={recommendation}
              hideOutOfStockItems={hideOutOfStockItems}
              shelfTitle={shelfTitle}
              trackingId={trackingId}
            />
          ) : (
            <Spinner />
          )}
        </>
      )}
    </div>
  )
}
MinicartRelated.propTypes = {
  /** Main product to have related products queried */
  slug: PropTypes.string,
  /** Graphql productQuery response. */
  productQuery: PropTypes.shape({
    /** Product to have related products queried */
    product: PropTypes.shape({
      productId: PropTypes.string,
    }),
    loading: PropTypes.bool,
  }),
  /** ProductList schema configuration */
  productList: PropTypes.shape(productListSchemaPropTypes),
  trackingId: PropTypes.string,
  shelfTitle: PropTypes.string,
  hideOutOfStockItems: PropTypes.bool,
}

MinicartRelated.defaultProps = {
  recommendation: 'similars',
  productList: {
    ...ProductList.defaultProps,
    titleText: 'Related Products',
  },
  groupBy: 'PRODUCT',
  shelfTitle: 'Related Products',
  hideOutOfStockItems: false,
}

MinicartRelated.schema = {
  title: 'Minicart: Related Products',
  description: 'Minicart related products feed',
  type: 'object',
  properties: {
    recommendation: {
      title: 'Type of Recommendation',
      description: 'admin/editor.relatedProducts.recommendation.description',
      type: 'string',
      default: MinicartRelated.defaultProps.recommendation,
      enum: [
        'similars',
        'view',
        'buy',
        'accessories',
        'viewAndBought',
        'suggestions',
      ],
      enumNames: [
        'Similars',
        'Who saw this, also viewed...',
        'Who bought this, also bought...',
        'Accessories',
        'Who saw this, also bought...',
        'Suggestions',
      ],
    },
    groupBy: {
      title: 'Group items by',
      description: '',
      type: 'string',
      default: MinicartRelated.defaultProps.groupBy,
      enum: ['PRODUCT', 'NONE'],
      enumNames: ['Product', 'None'],
    },
    shelfTitle: {
      title: MinicartRelated.defaultProps.shelfTitle,
      description: '',
      type: 'string',
      default: 'Related Products',
    },
    hideOutOfStockItems: {
      title: 'Hide unavailable items?',
      type: 'boolean',
      default: false,
    },
  },
}

export default MinicartRelated
