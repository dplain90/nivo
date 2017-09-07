/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React from 'react'
import Container from '../Container'
import SvgWrapper from '../SvgWrapper'
import enhance from './enhance'
import { ChordPropTypes } from './props'
import ChordRibbons from './ChordRibbons'
import ChordArcs from './ChordArcs'
import ChordLabels from './ChordLabels'

const Chord = ({
    // dimensions
    margin,
    width,
    height,
    outerWidth,
    outerHeight,

    // arcs
    arcBorderWidth,

    // ribbons
    ribbonBorderWidth,

    // labels
    enableLabels,
    getLabel, // computed
    labelOffset,
    labelRotation,
    getLabelTextColor,

    arcGenerator, // computed
    ribbonGenerator, // computed

    // theming
    theme,

    // interactivity
    isInteractive,

    // motion
    animate,
    motionDamping,
    motionStiffness,

    ribbons, // computed
    arcs, // computed
    radius, // computed
    setCurrentArc,
    setCurrentRibbon,
    getArcOpacity,
    getRibbonOpacity,
}) => {
    const centerX = width / 2
    const centerY = height / 2

    const motionProps = {
        animate,
        motionDamping,
        motionStiffness,
    }

    return (
        <Container isInteractive={isInteractive} theme={theme}>
            {({ showTooltip, hideTooltip }) => {
                return (
                    <SvgWrapper width={outerWidth} height={outerHeight} margin={margin}>
                        <g transform={`translate(${centerX}, ${centerY})`}>
                            <ChordRibbons
                                ribbons={ribbons}
                                shapeGenerator={ribbonGenerator}
                                borderWidth={ribbonBorderWidth}
                                getOpacity={getRibbonOpacity}
                                setCurrent={setCurrentRibbon}
                                theme={theme}
                                showTooltip={showTooltip}
                                hideTooltip={hideTooltip}
                                {...motionProps}
                            />
                            <ChordArcs
                                arcs={arcs}
                                shapeGenerator={arcGenerator}
                                borderWidth={arcBorderWidth}
                                getOpacity={getArcOpacity}
                                setCurrent={setCurrentArc}
                                theme={theme}
                                showTooltip={showTooltip}
                                hideTooltip={hideTooltip}
                                {...motionProps}
                            />
                            {enableLabels && (
                                <ChordLabels
                                    arcs={arcs}
                                    radius={radius + labelOffset}
                                    rotation={labelRotation}
                                    getLabel={getLabel}
                                    getColor={getLabelTextColor}
                                    theme={theme}
                                    {...motionProps}
                                />
                            )}
                        </g>
                    </SvgWrapper>
                )
            }}
        </Container>
    )
}

Chord.propTypes = ChordPropTypes

export default enhance(Chord)
