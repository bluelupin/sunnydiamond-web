"use client";

import React from "react";

type FeatureErrorBoundaryProps = {
  children: React.ReactNode;
  /** Used in console output to identify which overlay failed. */
  featureName: string;
};

type FeatureErrorBoundaryState = {
  hasError: boolean;
};

/**
 * Keeps optional global UI (drawers, modals) from taking down the active page
 * when they throw during render.
 */
export class FeatureErrorBoundary extends React.Component<
  FeatureErrorBoundaryProps,
  FeatureErrorBoundaryState
> {
  state: FeatureErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): FeatureErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[${this.props.featureName}]`, error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
