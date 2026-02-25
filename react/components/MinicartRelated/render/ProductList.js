/* eslint-disable react/prop-types */
import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import { IOMessage, formatIOMessage } from 'vtex.native-types'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'

import ShelfItem from './ShelfItem'
import {
  productListSchemaPropTypes,
  shelfItemPropTypes,
} from '../../../utils/propTypes'
import ProductListEventCaller from './ProductListEventCaller'

const DEFAULT_MAX_ITEMS = 10

/**
 * Product List Component. Shows a collection of products.
 */
const ProductList = ({
  summary,
  maxItems,
  products,
  isMobile,
  showTitle,
  titleText,
  trackingId,
  shelfTitle,
}) => {
  let listName = trackingId

  const sliderSettings = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    centerMode: true,
  }

  if (!listName) {
    listName =
      showTitle && titleText ? formatIOMessage(titleText) : 'List of products'
  }

  return products && !products.length ? null : (
    <Fragment>
      {showTitle && (
        <div
          className={`title t-heading-2 fw3 w-100 flex justify-center pt7 pb6 c-muted-1`}
        >
          {shelfTitle}
        </div>
      )}
      <div className="productList">
        {isMobile ? (
          <Slider {...sliderSettings}>
            {products &&
              products
                .slice(0, maxItems)
                .map((item, index) => (
                  <ShelfItem
                    item={item}
                    position={index + 1}
                    summary={summary}
                    listName={listName}
                  />
                ))}
          </Slider>
        ) : (
          <>
            {products &&
              products
                .slice(0, maxItems)
                .map((item, index) => (
                  <ShelfItem
                    item={item}
                    position={index + 1}
                    summary={summary}
                    listName={listName}
                  />
                ))}
          </>
        )}
      </div>

      <ProductListEventCaller />
    </Fragment>
  )
}

ProductList.defaultProps = {
  maxItems: DEFAULT_MAX_ITEMS,
  showTitle: true,
  titleText: null,
  isMobile: false,
}

ProductList.propTypes = {
  /** Loading status */
  loading: PropTypes.bool,
  /** Graphql data response. */
  products: PropTypes.arrayOf(shelfItemPropTypes.item),
  /** Verifies if is a mobile device. */
  isMobile: PropTypes.bool,
  /** Should display navigation dots below the Shelf */
  trackingId: PropTypes.string,
  ...productListSchemaPropTypes,
}

export default ProductList
