import React, { useState, useEffect, useRef } from 'react';
import { 
  RotateCw, 
  ShieldCheck, 
  QrCode, 
  Wifi, 
  Zap, 
  Layers,
  Compass,
  Navigation
} from 'lucide-react';
import './InteractiveLanyardBadge.css';

const TIERS = [
  {
    id: 'staff',
    name: 'Staff Engineer',
    clearance: 'Clearance Lv.5',
    dept: 'Core Hardware & AI Systems',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    strapColor1: '#1e1b4b',
    strapColor2: '#312e81',
    strapText: 'JOMNENH-KH ARCHITECT // HARDWARE & AI // STAFF CLEARANCE 2026 // RFID',
  },
  {
    id: 'vip',
    name: 'VIP Founder',
    clearance: 'VIP Global Pass',
    dept: 'Executive & Global Provenance',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    strapColor1: '#292524',
    strapColor2: '#44403c',
    strapText: 'JOMNENH-KH VIP FOUNDER // GLOBAL PROVENANCE // ALL-ACCESS UNLOCKED // GOLD',
  },
  {
    id: 'stealth',
    name: 'Cyberpunk Stealth',
    clearance: 'SpecOps Tier-1',
    dept: 'Encrypted Security & Networks',
    accentColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    strapColor1: '#09090b',
    strapColor2: '#18181b',
    strapText: 'JOMNENH-KH STEALTH PROTOCOL // ZERO-TRUST ACCESS // LEVEL-0 // ENCRYPTED',
  },
];

export const calculateDirection = (dx, dy) => {
  const dist = Math.hypot(dx, dy);
  if (dist < 6) {
    return { name: 'Neutral', cardinal: 'Center', arrow: '•', angle: 0, code: 'CTR', distance: Math.round(dist) };
  }
  // Math.atan2(dy, dx): 0° = East (Right), 90° = South (Down), -90° = North (Up), 180/-180° = West (Left)
  const deg = Math.atan2(dy, dx) * (180 / Math.PI);
  const roundedDeg = Math.round(deg);

  let name = 'Right';
  let cardinal = 'East';
  let arrow = '→';
  let code = 'E';

  if (deg >= -22.5 && deg < 22.5) {
    name = 'Right'; cardinal = 'East'; arrow = '→'; code = 'E';
  } else if (deg >= 22.5 && deg < 67.5) {
    name = 'Down-Right'; cardinal = 'Southeast'; arrow = '↘'; code = 'SE';
  } else if (deg >= 67.5 && deg < 112.5) {
    name = 'Down'; cardinal = 'South'; arrow = '↓'; code = 'S';
  } else if (deg >= 112.5 && deg < 157.5) {
    name = 'Down-Left'; cardinal = 'Southwest'; arrow = '↙'; code = 'SW';
  } else if (deg >= -67.5 && deg < -22.5) {
    name = 'Up-Right'; cardinal = 'Northeast'; arrow = '↗'; code = 'NE';
  } else if (deg >= -112.5 && deg < -67.5) {
    name = 'Up'; cardinal = 'North'; arrow = '↑'; code = 'N';
  } else if (deg >= -157.5 && deg < -112.5) {
    name = 'Up-Left'; cardinal = 'Northwest'; arrow = '↖'; code = 'NW';
  } else {
    name = 'Left'; cardinal = 'West'; arrow = '←'; code = 'W';
  }

  return { name, cardinal, arrow, angle: roundedDeg, code, distance: Math.round(dist) };
};

const InteractiveLanyardBadge = ({
  initialName = 'Alex Rivera',
  initialRole = 'Lead Hardware & AI Architect',
  initialAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  stageHeight = 620,
  onDragDirection,
}) => {
  const [tierIndex, setTierIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [name, setName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  const activeTier = TIERS[tierIndex];

  // Physics state refs (60 FPS smooth updates without React render latency)
  const stageRef = useRef(null);
  const cardAssemblyRef = useRef(null);
  const svgCordRef = useRef(null);
  const glareRef = useRef(null);

  // Direction HUD & Gyro Sensor DOM refs
  const directionHudRef = useRef(null);
  const hudArrowRef = useRef(null);
  const hudTextRef = useRef(null);
  const hudMetricsRef = useRef(null);
  const cardGyroIconRef = useRef(null);
  const cardGyroTextRef = useRef(null);

  const physicsRef = useRef({
    // Resting coordinates of top attachment clip
    restX: 0,
    restY: 145,

    // Current card attachment point relative to anchor (0, 0)
    x: 0,
    y: 145,

    // Velocities
    vx: 0,
    vy: 0,

    // Angular orientation (Z rotation degrees)
    angle: 0,
    angleV: 0,

    // 3D Pitch (rotateX) & Roll (rotateY)
    roll: 0,
    pitch: 0,

    // Mouse movement vector tracking
    moveVx: 0,
    moveVy: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    currentDirection: { name: 'Neutral', cardinal: 'Center', arrow: '•', angle: 0, code: 'CTR', distance: 0 },

    // Interaction flags & memory
    isDragging: false,
    dragPointerId: null,
    pointerStartX: 0,
    pointerStartY: 0,
    cardOriginX: 0,
    cardOriginY: 0,

    // Velocity history for release fling
    history: [],
    lastTime: performance.now(),
  });

  // Responsive resting Y coordinate for mobile devices
  useEffect(() => {
    const updateResponsiveRest = () => {
      const w = window.innerWidth;
      const newRestY = w <= 380 ? 75 : (w <= 640 ? 82 : 145);
      physicsRef.current.restY = newRestY;
      if (!physicsRef.current.isDragging) {
        physicsRef.current.y = newRestY;
      }
    };
    updateResponsiveRest();
    window.addEventListener('resize', updateResponsiveRest);
    return () => window.removeEventListener('resize', updateResponsiveRest);
  }, []);

  // Toggle Card Flip
  const handleToggleFlip = () => {
    setIsFlipped(prev => !prev);
    // Add a tiny angular impulse on flip
    physicsRef.current.angleV += 2.5;
  };

  // Cycle Tiers
  const handleCycleTier = () => {
    setTierIndex(prev => (prev + 1) % TIERS.length);
    // Add physics bounce on change
    physicsRef.current.vy += 8;
    physicsRef.current.angleV += 4;
  };

  // Trigger a physical flick impulse
  const handleFlickBadge = () => {
    const p = physicsRef.current;
    p.vx += (Math.random() > 0.5 ? 1 : -1) * (18 + Math.random() * 12);
    p.vy += 6 + Math.random() * 8;
    p.angleV += (Math.random() > 0.5 ? 1 : -1) * (14 + Math.random() * 8);
  };

  // Pointer Down: Start Dragging
  const handlePointerDown = (e) => {
    // Ignore clicks on edit inputs or buttons
    if (e.target.closest('button') || e.target.closest('input')) return;

    const p = physicsRef.current;
    p.isDragging = true;
    p.dragPointerId = e.pointerId;
    p.pointerStartX = e.clientX;
    p.pointerStartY = e.clientY;
    p.lastPointerX = e.clientX;
    p.lastPointerY = e.clientY;
    p.cardOriginX = p.x;
    p.cardOriginY = p.y;
    p.vx = 0;
    p.vy = 0;
    p.moveVx = 0;
    p.moveVy = 0;
    p.angleV = 0;
    p.currentDirection = { name: 'Neutral', cardinal: 'Center', arrow: '•', angle: 0, code: 'CTR', distance: 0 };
    p.history = [{ x: e.clientX, y: e.clientY, time: performance.now() }];

    if (cardAssemblyRef.current) {
      cardAssemblyRef.current.classList.add('is-dragging');
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Pointer Move: Dragging Card & Direction Detection
  const handlePointerMove = (e) => {
    const p = physicsRef.current;
    if (!p.isDragging || p.dragPointerId !== e.pointerId) return;

    const dx = e.clientX - p.pointerStartX;
    const dy = e.clientY - p.pointerStartY;

    // Movement delta and velocity since last pointer event
    const moveDx = e.clientX - p.lastPointerX;
    const moveDy = e.clientY - p.lastPointerY;
    p.lastPointerX = e.clientX;
    p.lastPointerY = e.clientY;

    // Smooth movement velocities for directional banking
    p.moveVx = p.moveVx * 0.6 + moveDx * 0.4;
    p.moveVy = p.moveVy * 0.6 + moveDy * 0.4;

    // Calculate live direction from the mouse drag vector
    const dirInfo = calculateDirection(dx, dy);
    p.currentDirection = dirInfo;

    // Emit direction callback if consumer subscribed
    if (onDragDirection) {
      onDragDirection({
        ...dirInfo,
        dx: Math.round(dx),
        dy: Math.round(dy),
        moveDx: Math.round(moveDx),
        moveDy: Math.round(moveDy),
        isDragging: true,
      });
    }

    // Target position with soft rubber-band resistance if dragged very far
    const rawTargetX = p.cardOriginX + dx;
    const rawTargetY = p.cardOriginY + dy;

    // Rubber-band resistance
    const maxDist = 240;
    const distFromRest = Math.hypot(rawTargetX, rawTargetY - p.restY);
    let scale = 1;
    if (distFromRest > maxDist) {
      scale = maxDist / distFromRest + 0.15;
    }

    p.x = rawTargetX * scale;
    // Don't let card go way above the ceiling anchor
    p.y = Math.max(40, rawTargetY);

    // Track pointer history for flick velocity
    const now = performance.now();
    p.history.push({ x: e.clientX, y: e.clientY, time: now });
    if (p.history.length > 5) p.history.shift();
  };

  // Pointer Up: Release & Fling
  const handlePointerUp = (e) => {
    const p = physicsRef.current;
    if (!p.isDragging || p.dragPointerId !== e.pointerId) return;

    p.isDragging = false;
    p.dragPointerId = null;
    p.moveVx = 0;
    p.moveVy = 0;

    if (onDragDirection) {
      onDragDirection({
        name: 'Idle',
        cardinal: 'Rest',
        arrow: '•',
        angle: 0,
        code: 'IDLE',
        dx: 0,
        dy: 0,
        distance: 0,
        isDragging: false,
      });
    }

    if (cardAssemblyRef.current) {
      cardAssemblyRef.current.classList.remove('is-dragging');
    }

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    // Calculate release velocity from pointer history
    if (p.history.length >= 2) {
      const first = p.history[0];
      const last = p.history[p.history.length - 1];
      const dt = Math.max(16, last.time - first.time);
      const vx = ((last.x - first.x) / dt) * 16;
      const vy = ((last.y - first.y) / dt) * 16;

      // Apply release momentum to physics
      p.vx = Math.max(-28, Math.min(28, vx * 0.85));
      p.vy = Math.max(-25, Math.min(25, vy * 0.85));
      p.angleV = Math.max(-22, Math.min(22, vx * 0.7));
    }
  };

  // Main 60FPS Physics Animation Loop
  useEffect(() => {
    let animId;

    const updatePhysics = () => {
      const p = physicsRef.current;
      const now = performance.now();
      const dt = Math.min(32, now - p.lastTime) / 16.666; // Normalized to 60fps frame
      p.lastTime = now;

      // Stage dimensions
      const stageW = stageRef.current ? stageRef.current.clientWidth : 420;
      const anchorX = stageW / 2;
      const anchorY = 0;

      if (!p.isDragging) {
        // Natural ambient pendulum oscillation & floating breeze
        const idleWave = Math.sin(now * 0.0022) * 5.5 + Math.sin(now * 0.0011) * 2.5;
        const targetRestX = idleWave;
        const targetRestY = p.restY + Math.cos(now * 0.0028) * 3;

        // Spring force towards resting hang point
        const kSpring = 0.048;
        const damping = 0.87;

        const fx = -kSpring * (p.x - targetRestX);
        const fy = -kSpring * (p.y - targetRestY);

        p.vx = (p.vx + fx * dt) * damping;
        p.vy = (p.vy + fy * dt) * damping;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Angular pendulum physics
        // Natural angle aligns with string vector from anchor (0, 0) to (x, y)
        const stringAngle = Math.atan2(p.x, p.y) * (180 / Math.PI);
        const kAngle = 0.065;
        const angleDamping = 0.88;

        const torque = -kAngle * (p.angle - stringAngle) - p.vx * 0.45;
        p.angleV = (p.angleV + torque * dt) * angleDamping;
        p.angle += p.angleV * dt;

        // 3D Roll and Pitch damping
        p.roll *= 0.91;
        p.pitch *= 0.91;
      } else {
        // While dragging: tilt angle follows pull direction and horizontal velocity
        const stringAngle = Math.atan2(p.x, p.y) * (180 / Math.PI);
        p.angle = stringAngle * 0.75;

        // 3D Tilt banking dynamically towards mouse direction and drag velocity
        p.roll = Math.max(-36, Math.min(36, -p.x * 0.18 + p.moveVx * 0.9));
        p.pitch = Math.max(-30, Math.min(30, (p.y - p.restY) * 0.15 + p.moveVy * 0.9));
      }

      // Update Card Assembly DOM Transform
      if (cardAssemblyRef.current) {
        const posX = p.x;
        const posY = p.y;
        const rotZ = p.angle;
        const rotY = p.roll;
        const rotX = p.pitch;

        cardAssemblyRef.current.style.transform = `
          translate3d(calc(-50% + ${posX.toFixed(2)}px), ${posY.toFixed(2)}px, 0px)
          rotateZ(${rotZ.toFixed(2)}deg)
          rotateY(${rotY.toFixed(2)}deg)
          rotateX(${rotX.toFixed(2)}deg)
        `;
      }

      // Update Dynamic Holographic Glare
      if (glareRef.current) {
        const holoAngle = 125 + p.angle * 2.2 + p.roll * 1.6;
        const holoOpacity = Math.min(0.65, 0.16 + (Math.abs(p.roll) + Math.abs(p.pitch)) * 0.015);
        const holoOffsetX = (p.x * 0.6) % 120;
        const holoOffsetY = (p.y * 0.6) % 120;

        glareRef.current.style.setProperty('--holo-angle', `${holoAngle.toFixed(1)}deg`);
        glareRef.current.style.setProperty('--holo-opacity', `${holoOpacity.toFixed(2)}`);
        glareRef.current.style.setProperty('--holo-offset-x', `${holoOffsetX.toFixed(1)}px`);
        glareRef.current.style.setProperty('--holo-offset-y', `${holoOffsetY.toFixed(1)}px`);
      }

      // Update Live Direction HUD & Card Gyro Sensor
      if (directionHudRef.current) {
        if (p.isDragging && p.currentDirection.name !== 'Neutral') {
          directionHudRef.current.classList.add('is-active');
          const d = p.currentDirection;
          if (hudArrowRef.current) {
            hudArrowRef.current.style.transform = `rotate(${d.angle}deg)`;
          }
          if (hudTextRef.current) {
            hudTextRef.current.textContent = `${d.arrow} ${d.name.toUpperCase()}`;
          }
          if (hudMetricsRef.current) {
            hudMetricsRef.current.textContent = `${d.angle}° · ${d.distance}px`;
          }
          if (cardGyroTextRef.current) {
            cardGyroTextRef.current.textContent = `VEC: ${d.code} ${d.arrow} ${d.angle}°`;
          }
          if (cardGyroIconRef.current) {
            cardGyroIconRef.current.style.transform = `rotate(${d.angle}deg)`;
          }
        } else {
          directionHudRef.current.classList.remove('is-active');
          if (cardGyroTextRef.current) {
            cardGyroTextRef.current.textContent = 'NFC 13.56MHz';
          }
          if (cardGyroIconRef.current) {
            cardGyroIconRef.current.style.transform = 'none';
          }
        }
      }

      // Update SVG Lanyard Cord & Straps
      if (svgCordRef.current) {
        const cardClipX = anchorX + p.x;
        const cardClipY = p.y - 36; // Clasp attaches above card top

        // Left strap from ceiling (-36px) to clasp
        const leftAnchorX = anchorX - 36;
        const leftAnchorY = anchorY;

        // Right strap from ceiling (+36px) to clasp
        const rightAnchorX = anchorX + 36;
        const rightAnchorY = anchorY;

        // Bezier control points simulate natural cloth slack & gravity
        const midY = Math.max(15, cardClipY * 0.52 + Math.abs(p.x) * 0.12);
        const leftCtrlX = leftAnchorX + p.x * 0.42;
        const rightCtrlX = rightAnchorX + p.x * 0.42;

        const pathLeft = `M ${leftAnchorX} ${leftAnchorY} Q ${leftCtrlX} ${midY} ${cardClipX - 6} ${cardClipY}`;
        const pathRight = `M ${rightAnchorX} ${rightAnchorY} Q ${rightCtrlX} ${midY} ${cardClipX + 6} ${cardClipY}`;

        const leftEl = svgCordRef.current.querySelector('#lanyard-strap-left');
        const rightEl = svgCordRef.current.querySelector('#lanyard-strap-right');
        const stitchLeftEl = svgCordRef.current.querySelector('#lanyard-stitch-left');
        const stitchRightEl = svgCordRef.current.querySelector('#lanyard-stitch-right');

        if (leftEl) leftEl.setAttribute('d', pathLeft);
        if (rightEl) rightEl.setAttribute('d', pathRight);
        if (stitchLeftEl) stitchLeftEl.setAttribute('d', pathLeft);
        if (stitchRightEl) stitchRightEl.setAttribute('d', pathRight);
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div 
      className={`lanyard-badge-stage tier-${activeTier.id}`}
      ref={stageRef}
      style={{ height: `${stageHeight}px` }}
    >
      {/* 1. Ceiling Mounting Anchor Plate */}
      <div className="lanyard-ceiling-anchor">
        <div className="lanyard-anchor-center-led" />
      </div>

      {/* 2. SVG Lanyard Ribbon Cords */}
      <svg className="lanyard-svg-canvas" ref={svgCordRef}>
        <defs>
          {/* Lanyard Strap Gradient */}
          <linearGradient id="lanyardGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={activeTier.strapColor1} />
            <stop offset="50%" stopColor={activeTier.strapColor2} />
            <stop offset="100%" stopColor={activeTier.strapColor1} />
          </linearGradient>
          <linearGradient id="lanyardGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={activeTier.strapColor1} />
            <stop offset="50%" stopColor={activeTier.strapColor2} />
            <stop offset="100%" stopColor={activeTier.strapColor1} />
          </linearGradient>

          {/* Stitch Line Dash Filter */}
          <filter id="cordShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Shadow Underlay */}
        <path
          id="lanyard-strap-shadow"
          fill="none"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="18"
          strokeLinecap="round"
          filter="url(#cordShadow)"
        />

        {/* Left Strap Ribbon */}
        <path
          id="lanyard-strap-left"
          fill="none"
          stroke="url(#lanyardGradLeft)"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* Left Stitch Line */}
        <path
          id="lanyard-stitch-left"
          fill="none"
          stroke={activeTier.accentColor}
          strokeWidth="1.2"
          strokeDasharray="4 3"
          strokeOpacity="0.75"
        />

        {/* Right Strap Ribbon */}
        <path
          id="lanyard-strap-right"
          fill="none"
          stroke="url(#lanyardGradRight)"
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* Right Stitch Line */}
        <path
          id="lanyard-stitch-right"
          fill="none"
          stroke={activeTier.accentColor}
          strokeWidth="1.2"
          strokeDasharray="4 3"
          strokeOpacity="0.75"
        />
      </svg>

      {/* Live Floating Direction HUD (Visual feedback on mouse drag) */}
      <div className="lanyard-direction-hud" ref={directionHudRef}>
        <div className="hud-compass-icon" ref={hudArrowRef}>
          <Navigation size={13} />
        </div>
        <div className="hud-direction-info">
          <span className="hud-direction-title">MOUSE VECTOR</span>
          <span className="hud-direction-value" ref={hudTextRef}>NEUTRAL</span>
        </div>
        <div className="hud-angle-pill" ref={hudMetricsRef}>
          0° · 0px
        </div>
      </div>

      {/* 3. The 3D Hanging Card Assembly (Physics-driven) */}
      <div 
        className={`lanyard-card-assembly ${isFlipped ? 'is-flipped' : ''}`}
        ref={cardAssemblyRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Hardware Metallic Clasp Connecting Lanyard to Card */}
        <div className="lanyard-hardware-clamp">
          <div className="lanyard-crimp" />
          <div className="lanyard-swivel-ring" />
          <div className="lanyard-hook-body">
            <div className="lanyard-hook-spring-latch" />
          </div>
        </div>

        {/* Realistic Ground / Backdrop Shadow */}
        <div className="lanyard-card-shadow" />

        {/* Flippable 3D Card Body */}
        <div className="lanyard-card-flipper">
          
          {/* ================= CARD FRONT ================= */}
          <div className="lanyard-card-face card-front">
            {/* Dynamic Holographic Foil Glare */}
            <div className="lanyard-holographic-glare" ref={glareRef} />

            {/* Top Lanyard Clip Slot Cutout */}
            <div className="badge-lanyard-slot" />

            {/* Brand Title & Clearance Level */}
            <div className="badge-header-row">
              <div className="badge-brand-title">
                <span className="badge-brand-dot" />
                JOMNENH-KH // LABS
              </div>
              <span className="badge-clearance-pill">
                {activeTier.clearance}
              </span>
            </div>

            {/* Smartcard Gold Microchip & Dynamic Direction/RFID Indicator */}
            <div className="badge-microchip-row">
              <div className="badge-sim-chip" title="Hardware Encrypted Auth Microchip" />
              <div className="badge-nfc-indicator">
                <Compass size={13} ref={cardGyroIconRef} style={{ transition: 'transform 0.08s ease' }} />
                <span ref={cardGyroTextRef}>NFC 13.56MHz</span>
              </div>
            </div>

            {/* Avatar & Profile Identity */}
            <div className="badge-avatar-container">
              <div className="badge-avatar-frame">
                <img 
                  src={initialAvatar} 
                  alt={name} 
                  className="badge-avatar-img" 
                  draggable={false}
                />
                <div className="badge-avatar-status-beacon" title="Biometrically Authenticated" />
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                  autoFocus
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid #38bdf8',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '2px 8px',
                    fontSize: '1rem',
                    textAlign: 'center',
                    marginBottom: '4px',
                    outline: 'none',
                  }}
                />
              ) : (
                <div 
                  className="badge-person-name"
                  onClick={() => setIsEditing(true)}
                  title="Click to rename"
                >
                  {name}
                </div>
              )}

              <div className="badge-person-role">{initialRole}</div>
            </div>

            {/* Barcode with Animated Laser Scan */}
            <div className="badge-barcode-container">
              <div className="barcode-laser-sweep" />
              <div className="barcode-lines-row">
                {[4, 2, 6, 2, 8, 3, 4, 2, 7, 3, 5, 2, 9, 4, 3, 6, 2, 8, 3, 5, 2, 7].map((w, i) => (
                  <div 
                    key={i} 
                    className="barcode-bar" 
                    style={{ width: `${w}px` }} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ================= CARD BACK ================= */}
          <div className="lanyard-card-face card-back">
            {/* Top Lanyard Clip Slot */}
            <div className="badge-lanyard-slot" />

            {/* High-Coercivity Magnetic Stripe */}
            <div className="badge-magnetic-stripe" />

            <div className="badge-back-terms">
              <strong>JOMNENH-KH PASS</strong>
            </div>

            {/* Security Tamper Seal & Verification QR */}
            <div className="badge-back-security-row">
              <div className="badge-tamper-seal">
                <ShieldCheck size={20} />
                <span>SEALED</span>
              </div>
              <div className="badge-qr-box">
                <QrCode size={44} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Interactive Dock Controls */}
      <div className="badge-control-dock">
        <button 
          className="badge-action-btn"
          onClick={handleToggleFlip}
          title="Flip ID Badge to opposite side"
        >
          <RotateCw size={13} />
          <span>{isFlipped ? 'Show Front' : 'Flip Pass'}</span>
        </button>

        <button 
          className="badge-action-btn"
          onClick={handleFlickBadge}
          title="Toss / Swing the badge with momentum"
        >
          <Zap size={13} />
          <span>Flick</span>
        </button>

        <button 
          className="badge-action-btn"
          onClick={handleCycleTier}
          title="Switch Pass Tier & Colorway"
        >
          <Layers size={13} />
          <span>{activeTier.name.split(' ')[0]}</span>
        </button>
      </div>
    </div>
  );
};

export default InteractiveLanyardBadge;
