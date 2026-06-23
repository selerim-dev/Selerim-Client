'use client';

import React from 'react';

/**
 * Fixed full-viewport atmospheric backdrop: drifting aurora, a bright
 * "glare" bloom (the reference sun/orb), and a faint film grain.
 * All colors read from theme CSS variables, so it cross-fades on
 * theme/scene change automatically.
 */
export default function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere__aurora" />
      <div className="atmosphere__glare" />
      <div className="atmosphere__grain" />
    </div>
  );
}
