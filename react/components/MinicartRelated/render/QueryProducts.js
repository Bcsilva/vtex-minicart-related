import React from 'react'
import last from 'ramda/es/last'
import { Query } from 'react-apollo'
import { useDevice } from 'vtex.device-detector'
import { ProductListContext } from 'vtex.product-list-context'
import { useTreePath } from 'vtex.render-runtime'

import productRecommendationsQuery from '../../../graphql/queries/productRecommendations.gql'
import ProductList from './ProductList'
import { filterOutOfStock } from '../../../utils/filterOutOfStock'

const { ProductListProvider } = ProductListContext

const fixRecommendation = (recommendation) => {
  if (recommendation.includes('editor.relatedProducts.')) {
    return last(recommendation.split('.'))
  }
  return recommendation
}

export const QueryProducts = ({
  productList,
  productQuery,
  groupBy,
  recommendation: cmsRecommendation,
  trackingId: rawTrackingId,
  hideOutOfStockItems,
  shelfTitle,
}) => {
  // Mova os hooks para o topo, fora de qualquer bloco condicional
  const { isMobile } = useDevice()
  const treePath = useTreePath()

  if (!productQuery) return null
  const productId = productQuery.productId

  let trackingId = rawTrackingId
  if (!trackingId) {
    const treePathList =
      (typeof treePath === 'string' && treePath.split()) || []
    trackingId = treePathList[treePathList.length - 1] || 'List of products'
  }

  const recommendation = productId ? fixRecommendation(cmsRecommendation) : null
  const variables = {
    identifier: { field: 'id', value: productId },
    type: recommendation,
    groupBy,
  }

  // const variables = useMemo(() => {
  //   return {
  //     identifier: { field: 'id', value: productId },
  //     type: recommendation,
  //     groupBy,
  //   }
  // }, [productId, recommendation])

  return (
    <Query
      query={productRecommendationsQuery}
      variables={variables}
      partialRefetch
      ssr={false}
    >
      {({ data, loading }) => {
        if (!data) {
          return null
        }
        const { productRecommendations = [] } = data
        const productListProps = {
          products: hideOutOfStockItems
            ? filterOutOfStock(productRecommendations)
            : productRecommendations,
          loading,
          ...productList,
          isMobile,
          trackingId,
          shelfTitle,
        }
        return (
          <div>
            <ProductListProvider listName={trackingId}>
              <ProductList {...productListProps} />
            </ProductListProvider>
          </div>
        )
      }}
    </Query>
  )
}

export default QueryProducts
