// eslint-disable-next-line no-restricted-imports
/* eslint-disable react/prop-types */
import React, { Component, useState } from 'react'
import { withCssHandles } from 'vtex.css-handles'

import ShelfItem from './ShelfItem'
import { shelfContentPropTypes } from '../../../utils/propTypes'
// import shelf from './shelf.css'

const CSS_HANDLES = [
  'arrow',
  'arrowLeft',
  'arrowRight',
  'shelfContentContainer',
  'sliderContainer',
  'slide',
  'dot--isActive',
]

/**
 * ShelfContent Component. Executes the interaction with react-slick
 * and render the properly content of the Shelf depending of edit mode state.
 */
class ShelfContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentSlide: 0,
      firstRender: true,
    }
  }

  componentDidMount() {
    this.setState({
      firstRender: false,
    })
  }

  render() {
    const { summary, maxItems, products, cssHandles, listName } = this.props

    const productList =
      !products || !products.length ? Array(maxItems).fill(null) : products
    console.log(products)
    console.log(productList)
    console.log(maxItems)
    return (
      Number.isInteger(maxItems) &&
      Array.isArray(products) && (
        <div
          className={`${cssHandles.shelfContentContainer} flex justify-center`}
        >
          {productList &&
            productList
              .slice(0, 5)
              .map((item, index) => (
                <ShelfItem
                  item={item}
                  position={index + 1}
                  summary={summary}
                  listName={listName}
                />
              ))}
        </div>
      )
    )
  }
}

ShelfContent.defaultProps = {
  paginationDotsVisibility: 'visible',
}

ShelfContent.propTypes = {
  /** List of products */
  products: shelfContentPropTypes.products,
  /** Max Items per page */
  itemsPerPage: shelfContentPropTypes.itemsPerPage,
  /** Props to ProductsSummary */
  summary: shelfContentPropTypes.summary,
  /** Is mobile */
  isMobile: shelfContentPropTypes.isMobile,
  /** Title of the shelf */
  listName: shelfContentPropTypes.listName,
}

export default withCssHandles(CSS_HANDLES)(ShelfContent)
