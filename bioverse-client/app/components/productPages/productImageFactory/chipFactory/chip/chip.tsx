/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/
'use client';
import PropTypes from 'prop-types';
import React from 'react';
import { useReducer } from 'react';

interface Props {
    label: string;
    delete1: boolean;
    thumbnail: boolean;
    size: 'medium' | 'small';
    color:
        | 'warning'
        | 'info'
        | 'default'
        | 'success'
        | 'secondary'
        | 'primary'
        | 'error';
    stateProp: 'hovered' | 'disabled' | 'focused' | 'enabled';
    variant: 'outlined' | 'filled';
    className: any;
}

export const Chip = ({
    label = 'Chip',
    delete1 = false,
    thumbnail = false,
    size,
    color,
    stateProp,
    variant,
    className,
}: Props): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, {
        size: size || 'medium',
        color: color || 'default',
        state: stateProp || 'enabled',
        variant: variant || 'filled',
    });

    return (
        <div
            className={`inline-flex items-center overflow-hidden rounded-[100px] relative ${
                state.variant === 'outlined' ? 'border border-solid' : ''
            } ${
                state.color === 'default' && state.variant === 'outlined'
                    ? 'border-palette-components-chip-defaultenabledborder'
                    : state.variant === 'outlined' && state.color === 'primary'
                      ? 'border-palette-primary-main'
                      : state.variant === 'outlined' &&
                          state.color === 'secondary'
                        ? 'border-palette-secondary-main'
                        : state.variant === 'outlined' &&
                            state.color === 'error'
                          ? 'border-palette-error-main'
                          : state.color === 'warning' &&
                              state.variant === 'outlined'
                            ? 'border-palette-warning-main'
                            : state.variant === 'outlined' &&
                                state.color === 'info'
                              ? 'border-palette-info-main'
                              : state.variant === 'outlined' &&
                                  state.color === 'success'
                                ? 'border-palette-success-main'
                                : ''
            } ${state.state === 'disabled' ? 'opacity-[0.38]' : ''} ${
                state.size === 'small' ? 'px-[4px] py-[3px]' : 'p-[4px]'
            } ${
                state.color === 'default' &&
                state.variant === 'filled' &&
                ['disabled', 'enabled'].includes(state.state)
                    ? 'bg-palette-action-selected'
                    : state.color === 'default' &&
                        state.variant === 'filled' &&
                        state.state === 'hovered'
                      ? 'bg-palette-components-chip-defaulthoverfill'
                      : state.color === 'default' &&
                          state.variant === 'filled' &&
                          state.state === 'focused'
                        ? 'bg-palette-components-chip-defaultfocusfill'
                        : state.color === 'primary' &&
                            state.variant === 'filled' &&
                            ['disabled', 'enabled'].includes(state.state)
                          ? 'bg-palette-primary-main'
                          : state.color === 'primary' &&
                              state.variant === 'filled' &&
                              ['focused', 'hovered'].includes(state.state)
                            ? 'bg-palette-primary-dark'
                            : state.color === 'secondary' &&
                                state.variant === 'filled' &&
                                ['disabled', 'enabled'].includes(state.state)
                              ? 'bg-palette-secondary-main'
                              : state.color === 'secondary' &&
                                  state.variant === 'filled' &&
                                  ['focused', 'hovered'].includes(state.state)
                                ? 'bg-palette-secondary-dark'
                                : state.color === 'error' &&
                                    state.variant === 'filled' &&
                                    ['disabled', 'enabled'].includes(
                                        state.state,
                                    )
                                  ? 'bg-palette-error-main'
                                  : state.color === 'error' &&
                                      state.variant === 'filled' &&
                                      ['focused', 'hovered'].includes(
                                          state.state,
                                      )
                                    ? 'bg-palette-error-dark'
                                    : state.color === 'warning' &&
                                        state.variant === 'filled' &&
                                        ['disabled', 'enabled'].includes(
                                            state.state,
                                        )
                                      ? 'bg-palette-warning-main'
                                      : state.color === 'warning' &&
                                          state.variant === 'filled' &&
                                          ['focused', 'hovered'].includes(
                                              state.state,
                                          )
                                        ? 'bg-palette-warning-dark'
                                        : state.color === 'info' &&
                                            state.variant === 'filled' &&
                                            ['disabled', 'enabled'].includes(
                                                state.state,
                                            )
                                          ? 'bg-palette-info-main'
                                          : state.color === 'info' &&
                                              state.variant === 'filled' &&
                                              ['focused', 'hovered'].includes(
                                                  state.state,
                                              )
                                            ? 'bg-palette-info-dark'
                                            : (state.color === 'success' &&
                                                    state.size === 'small' &&
                                                    state.state === 'hovered' &&
                                                    state.variant ===
                                                        'filled') ||
                                                (state.color === 'success' &&
                                                    state.state ===
                                                        'disabled' &&
                                                    state.variant ===
                                                        'filled') ||
                                                (state.color === 'success' &&
                                                    state.state === 'enabled' &&
                                                    state.variant === 'filled')
                                              ? 'bg-palette-success-main'
                                              : (state.color === 'success' &&
                                                      state.size === 'medium' &&
                                                      state.state ===
                                                          'hovered' &&
                                                      state.variant ===
                                                          'filled') ||
                                                  (state.color === 'success' &&
                                                      state.state ===
                                                          'focused' &&
                                                      state.variant ===
                                                          'filled')
                                                ? 'bg-palette-success-dark'
                                                : ''
            } ${className}`}
            onMouseEnter={() => {
                dispatch('mouse_enter');
            }}
            onMouseLeave={() => {
                dispatch('mouse_leave');
            }}
        >
            <div
                className={`inline-flex flex-col items-start flex-[0_0_auto] relative ${
                    state.size === 'small'
                        ? 'px-[6px] py-0'
                        : 'px-[6px] py-[3px]'
                }`}
            >
                <div
                    className={`label1 ${
                        state.color === 'default'
                            ? 'text-palette-text-primary'
                            : state.variant === 'filled' &&
                                state.color === 'secondary'
                              ? 'text-palette-secondary-contrast'
                              : state.variant === 'filled' &&
                                  state.color === 'error'
                                ? 'text-palette-error-contrast'
                                : state.variant === 'filled' &&
                                    state.color === 'warning'
                                  ? 'text-palette-warning-contrast'
                                  : state.variant === 'filled' &&
                                      state.color === 'info'
                                    ? 'text-palette-info-contrast'
                                    : state.variant === 'filled' &&
                                        state.color === 'success'
                                      ? 'text-palette-success-contrast'
                                      : state.variant === 'outlined' &&
                                          state.color === 'primary'
                                        ? 'text-palette-primary-main'
                                        : state.variant === 'outlined' &&
                                            state.color === 'secondary'
                                          ? 'text-palette-secondary-main'
                                          : state.variant === 'outlined' &&
                                              state.color === 'error'
                                            ? 'text-palette-error-main'
                                            : state.color === 'warning' &&
                                                state.variant === 'outlined'
                                              ? 'text-palette-warning-main'
                                              : state.variant === 'outlined' &&
                                                  state.color === 'info'
                                                ? 'text-palette-info-main'
                                                : state.variant ===
                                                        'outlined' &&
                                                    state.color === 'success'
                                                  ? 'text-palette-success-main'
                                                  : 'text-palette-primary-contrast'
                    }`}
                >
                    {label}
                </div>
            </div>
        </div>
    );
};

function reducer(state: any, action: any) {
    switch (action) {
        case 'mouse_enter':
            return {
                ...state,
                state: 'hovered',
            };

        case 'mouse_leave':
            return {
                ...state,
                state: 'enabled',
            };
    }

    return state;
}

Chip.propTypes = {
    label: PropTypes.string,
    delete1: PropTypes.bool,
    thumbnail: PropTypes.bool,
    size: PropTypes.oneOf(['medium', 'small']),
    color: PropTypes.oneOf([
        'warning',
        'info',
        'default',
        'success',
        'secondary',
        'primary',
        'error',
    ]),
    stateProp: PropTypes.oneOf(['hovered', 'disabled', 'focused', 'enabled']),
    variant: PropTypes.oneOf(['outlined', 'filled']),
};
