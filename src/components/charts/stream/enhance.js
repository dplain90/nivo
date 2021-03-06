/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React from 'react'
import { min, max, range, sortBy } from 'lodash'
import { stack as d3Stack, area } from 'd3-shape'
import { scaleLinear, scalePoint } from 'd3-scale'
import compose from 'recompose/compose'
import defaultProps from 'recompose/defaultProps'
import pure from 'recompose/pure'
import withPropsOnChange from 'recompose/withPropsOnChange'
import { stackOrderFromProp, stackOffsetFromProp } from '../../../props'
import { withTheme, withCurve, withDimensions, withMotion } from '../../../hocs'
import { getColorRange } from '../../../lib/colors'
import { StreamDefaultProps } from './props'

const stackMin = layers => min(layers.reduce((acc, layer) => [...acc, ...layer.map(d => d[0])], []))
const stackMax = layers => max(layers.reduce((acc, layer) => [...acc, ...layer.map(d => d[1])], []))

export default Component =>
    compose(
        defaultProps(StreamDefaultProps),
        withTheme(),
        withCurve(),
        withDimensions(),
        withMotion(),
        withPropsOnChange(['curveInterpolator'], ({ curveInterpolator }) => ({
            areaGenerator: area()
                .x(({ x }) => x)
                .y0(({ y1 }) => y1)
                .y1(({ y2 }) => y2)
                .curve(curveInterpolator),
        })),
        withPropsOnChange(['colors'], ({ colors }) => ({
            getColor: getColorRange(colors),
        })),
        withPropsOnChange(['keys', 'offsetType', 'order'], ({ keys, offsetType, order }) => ({
            stack: d3Stack()
                .keys(keys)
                .offset(stackOffsetFromProp(offsetType))
                .order(stackOrderFromProp(order)),
        })),
        withPropsOnChange(
            ['stack', 'data', 'width', 'height'],
            ({ stack, data, width, height }) => {
                const layers = stack(data)
                layers.forEach(layer => {
                    layer.forEach(point => {
                        point.value = point.data[layer.key]
                    })
                })

                const minValue = stackMin(layers)
                const maxValue = stackMax(layers)

                return {
                    layers,
                    xScale: scalePoint()
                        .domain(range(data.length))
                        .range([0, width]),
                    yScale: scaleLinear()
                        .domain([minValue, maxValue])
                        .range([height, 0]),
                }
            }
        ),
        pure
    )(Component)
