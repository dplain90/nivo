/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { Component } from 'react'
import _ from 'lodash'
import { getLabelGenerator } from '../../../lib/propertiesConverters'
import { treeMapPropTypes, treeMapDefaultProps } from './TreeMapProps'
import TreeMapPlaceholders from './TreeMapPlaceholders'
import { getInheritedColorGenerator } from '../../../lib/colors'

const createNodes = ({
    borderWidth,
    borderColor,
    enableLabels,
    label: _label,
    labelFormat,
    orientLabels,
    labelSkipSize,
    labelTextColor,
}) => {
    const label = getLabelGenerator(_label, labelFormat)
    const borderColorFn = getInheritedColorGenerator(borderColor)
    const textColorFn = getInheritedColorGenerator(labelTextColor)

    return nodes => {
        const renderedNodes = []

        nodes.forEach(node => {
            const shouldRenderLabel =
                enableLabels &&
                (labelSkipSize === 0 ||
                    Math.min(node.style.width, node.style.height) > labelSkipSize)

            const rotate = shouldRenderLabel && orientLabels && node.style.height > node.style.width

            renderedNodes.push(
                <div
                    key={node.key}
                    className="nivo_treemap_node"
                    style={{
                        boxSizing: 'border-box',
                        position: 'absolute',
                        top: node.style.y,
                        left: node.style.x,
                        width: node.style.width,
                        height: node.style.height,
                        background: node.style.color,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: borderWidth,
                        borderStyle: 'solid',
                        borderColor: borderColorFn({ ...node.data, color: node.style.color }),
                    }}
                >
                    {shouldRenderLabel && (
                        <span
                            className="nivo_treemap_node_label"
                            style={{
                                color: textColorFn({ ...node.data, color: node.style.color }),
                                transform: `rotate(${rotate ? '-90' : '0'}deg)`,
                            }}
                        >
                            {label(node.data)}
                        </span>
                    )}
                </div>
            )
        })

        return renderedNodes
    }
}

export default class TreeMapHTML extends Component {
    static propTypes = _.omit(treeMapPropTypes, ['children', 'namespace'])

    static defaultProps = _.omit(treeMapDefaultProps, [])

    render() {
        return (
            <TreeMapPlaceholders {...this.props} namespace="html">
                {createNodes(this.props)}
            </TreeMapPlaceholders>
        )
    }
}
