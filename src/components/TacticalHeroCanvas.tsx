'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface TacticalHeroCanvasProps {
  viewMode?: 'COMMAND' | 'DOGFIGHT' | 'FLEET';
  onViewChange?: (mode: 'COMMAND' | 'DOGFIGHT' | 'FLEET') => void;
}

export const TacticalHeroCanvas: React.FC<TacticalHeroCanvasProps> = ({
  viewMode = 'COMMAND',
  onViewChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentViewRef = useRef<'COMMAND' | 'DOGFIGHT' | 'FLEET'>(viewMode);

  useEffect(() => {
    currentViewRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // ========================================================
    // 1. SCENE, CAMERA, RENDERER
    // ========================================================
    const scene = new THREE.Scene();
    // Atmospheric military twilight sky fog: deep twilight navy to gold horizon
    scene.fog = new THREE.FogExp2(0x061424, 0.0016);

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.5, 3000);
    camera.position.set(0, 18, 95);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ========================================================
    // 2. REALISTIC LIGHTING (WARM GOLDEN SUN & DEEP NAVY FILL)
    // ========================================================
    const ambientLight = new THREE.AmbientLight(0x1B354F, 1.4);
    scene.add(ambientLight);

    // Sun directional key light with golden dawn/sunset rim
    const sunLight = new THREE.DirectionalLight(0xF6C878, 2.8);
    sunLight.position.set(120, 90, 80);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Cyan maritime bounce light from ocean
    const seaBounceLight = new THREE.DirectionalLight(0x10486D, 1.2);
    seaBounceLight.position.set(-60, -40, -40);
    scene.add(seaBounceLight);

    // Distant horizon haze light
    const horizonPoint = new THREE.PointLight(0xD6AD60, 2.0, 450);
    horizonPoint.position.set(0, 20, -220);
    scene.add(horizonPoint);

    // ========================================================
    // 3. PROCEDURAL MILITARY TEXTURES & MATERIALS
    // ========================================================
    // Air Force camouflage texture (tactical two-tone low-vis grey)
    const createCamoTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(0, 0, 512, 512);

        ctx.fillStyle = '#34495E';
        for (let i = 0; i < 28; i++) {
          ctx.beginPath();
          ctx.arc(
            (i * 73) % 512,
            (i * 107) % 512,
            40 + (i % 6) * 12,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        ctx.fillStyle = '#1F2A38';
        for (let i = 0; i < 18; i++) {
          ctx.beginPath();
          ctx.arc(
            (i * 131) % 512,
            (i * 61) % 512,
            30 + (i % 4) * 10,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        // Panel lines
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.lineWidth = 2;
        for (let x = 32; x < 512; x += 64) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 512);
          ctx.stroke();
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };

    const camoTexture = createCamoTexture();

    // High quality military materials
    const jetBodyMat = new THREE.MeshStandardMaterial({
      map: camoTexture,
      roughness: 0.35,
      metalness: 0.75,
      color: 0x8A9BA8,
    });

    const jetDarkMat = new THREE.MeshStandardMaterial({
      color: 0x1A2530,
      roughness: 0.5,
      metalness: 0.8,
    });

    const canopyMat = new THREE.MeshPhysicalMaterial({
      color: 0xD6AD60,
      roughness: 0.05,
      metalness: 0.9,
      transmission: 0.5,
      transparent: true,
      opacity: 0.85,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const missileMat = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      roughness: 0.3,
      metalness: 0.4,
    });

    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
      transparent: true,
      opacity: 0.9,
    });

    const flameInnerMat = new THREE.MeshBasicMaterial({
      color: 0xFFFBEB,
      transparent: true,
      opacity: 0.95,
    });

    const warshipHullMat = new THREE.MeshStandardMaterial({
      color: 0x3E4E5E, // Naval haze grey
      roughness: 0.45,
      metalness: 0.65,
    });

    const warshipDeckMat = new THREE.MeshStandardMaterial({
      color: 0x22303E,
      roughness: 0.6,
      metalness: 0.4,
    });

    const tankArmorMat = new THREE.MeshStandardMaterial({
      color: 0x2E4032, // Army olive tactical
      roughness: 0.6,
      metalness: 0.5,
    });

    const tankTrackMat = new THREE.MeshStandardMaterial({
      color: 0x11161B,
      roughness: 0.8,
      metalness: 0.3,
    });

    // ========================================================
    // 4. MODEL BUILDER: SUPERSONIC FIGHTER JET
    // ========================================================
    const buildFighterJet = (scale = 1.0, isLeader = false) => {
      const jet = new THREE.Group();

      // Fuselage (aerodynamic needle nose + blended midbody)
      const radomeGeom = new THREE.ConeGeometry(0.8, 4.2, 16);
      const radome = new THREE.Mesh(radomeGeom, jetDarkMat);
      radome.rotation.x = Math.PI / 2;
      radome.position.set(0, 0, 7.8);
      jet.add(radome);

      // Main fuselage body
      const bodyGeom = new THREE.CylinderGeometry(1.2, 1.4, 11, 16);
      const body = new THREE.Mesh(bodyGeom, jetBodyMat);
      body.rotation.x = Math.PI / 2;
      body.scale.set(1.4, 1.0, 0.7);
      body.position.set(0, 0, 1.2);
      jet.add(body);

      // Cockpit Bubble Canopy
      const canopyGeom = new THREE.SphereGeometry(0.9, 20, 20);
      const canopy = new THREE.Mesh(canopyGeom, canopyMat);
      canopy.scale.set(0.75, 0.85, 3.2);
      canopy.position.set(0, 0.95, 3.8);
      jet.add(canopy);

      // Pilot helmet silhouette inside cockpit
      const helmetGeom = new THREE.SphereGeometry(0.35, 12, 12);
      const helmet = new THREE.Mesh(helmetGeom, jetDarkMat);
      helmet.position.set(0, 0.85, 4.1);
      jet.add(helmet);

      // Swept Delta Wings (with leading-edge extensions LERX)
      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 4);
      wingShape.lineTo(1.6, 2.5); // LERX
      wingShape.lineTo(11.5, -4.2); // Wingtip
      wingShape.lineTo(10.5, -5.2);
      wingShape.lineTo(2.2, -4.8); // Trailing edge
      wingShape.lineTo(0, -5.0);
      wingShape.lineTo(-2.2, -4.8);
      wingShape.lineTo(-10.5, -5.2);
      wingShape.lineTo(-11.5, -4.2);
      wingShape.lineTo(-1.6, 2.5);
      wingShape.closePath();

      const wingGeom = new THREE.ExtrudeGeometry(wingShape, { depth: 0.22, bevelEnabled: false });
      const wings = new THREE.Mesh(wingGeom, jetBodyMat);
      wings.rotation.x = Math.PI / 2;
      wings.position.set(0, 0.05, 0);
      jet.add(wings);

      // Twin Canted Vertical Stabilizers (Fins)
      const finGeom = new THREE.BoxGeometry(0.18, 3.2, 2.8);
      const leftFin = new THREE.Mesh(finGeom, jetBodyMat);
      leftFin.position.set(-1.8, 1.7, -3.8);
      leftFin.rotation.z = -0.22;
      leftFin.rotation.x = -0.15;
      jet.add(leftFin);

      const rightFin = new THREE.Mesh(finGeom, jetBodyMat);
      rightFin.position.set(1.8, 1.7, -3.8);
      rightFin.rotation.z = 0.22;
      rightFin.rotation.x = -0.15;
      jet.add(rightFin);

      // All-moving Horizontal Stabilators
      const stabGeom = new THREE.BoxGeometry(3.2, 0.12, 2.0);
      const leftStab = new THREE.Mesh(stabGeom, jetBodyMat);
      leftStab.position.set(-2.8, 0, -5.0);
      leftStab.rotation.y = 0.18;
      jet.add(leftStab);

      const rightStab = new THREE.Mesh(stabGeom, jetBodyMat);
      rightStab.position.set(2.8, 0, -5.0);
      rightStab.rotation.y = -0.18;
      jet.add(rightStab);

      // Wingtip Missile Rails & Missiles
      const makeMissile = (x: number) => {
        const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 1.8), jetDarkMat);
        pylon.position.set(x, -0.2, -0.8);
        jet.add(pylon);

        const mBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.6, 8), missileMat);
        mBody.rotation.x = Math.PI / 2;
        mBody.position.set(x, -0.4, -0.8);
        jet.add(mBody);

        const mHead = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.6, 8), jetDarkMat);
        mHead.rotation.x = Math.PI / 2;
        mHead.position.set(x, -0.4, 0.6);
        jet.add(mHead);
      };

      makeMissile(-5.5);
      makeMissile(5.5);
      makeMissile(-9.5);
      makeMissile(9.5);

      // Twin Engine Exhaust Nozzles
      const nozzleGeom = new THREE.CylinderGeometry(0.7, 0.78, 1.4, 16);
      const leftNozzle = new THREE.Mesh(nozzleGeom, jetDarkMat);
      leftNozzle.rotation.x = Math.PI / 2;
      leftNozzle.position.set(-1.1, 0, -4.6);
      jet.add(leftNozzle);

      const rightNozzle = new THREE.Mesh(nozzleGeom, jetDarkMat);
      rightNozzle.rotation.x = Math.PI / 2;
      rightNozzle.position.set(1.1, 0, -4.6);
      jet.add(rightNozzle);

      // Dynamic Supersonic Afterburner Flames (Mach Diamonds)
      const afterburnerGroup = new THREE.Group();
      const flameOuterGeom = new THREE.ConeGeometry(0.65, 3.8, 12);
      const leftFlame = new THREE.Mesh(flameOuterGeom, flameMat);
      leftFlame.rotation.x = -Math.PI / 2;
      leftFlame.position.set(-1.1, 0, -6.6);
      afterburnerGroup.add(leftFlame);

      const rightFlame = new THREE.Mesh(flameOuterGeom, flameMat);
      rightFlame.rotation.x = -Math.PI / 2;
      rightFlame.position.set(1.1, 0, -6.6);
      afterburnerGroup.add(rightFlame);

      // White-hot inner core
      const flameInnerGeom = new THREE.ConeGeometry(0.35, 2.4, 12);
      const leftInnerFlame = new THREE.Mesh(flameInnerGeom, flameInnerMat);
      leftInnerFlame.rotation.x = -Math.PI / 2;
      leftInnerFlame.position.set(-1.1, 0, -5.8);
      afterburnerGroup.add(leftInnerFlame);

      const rightInnerFlame = new THREE.Mesh(flameInnerGeom, flameInnerMat);
      rightInnerFlame.rotation.x = -Math.PI / 2;
      rightInnerFlame.position.set(1.1, 0, -5.8);
      afterburnerGroup.add(rightInnerFlame);

      jet.add(afterburnerGroup);

      // Trailing High-G Contrail Ribbons (Wingtip vortices)
      const trailGeom = new THREE.CylinderGeometry(0.08, 0.6, 18, 8);
      const trailMat = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.35,
      });
      const leftTrail = new THREE.Mesh(trailGeom, trailMat);
      leftTrail.rotation.x = Math.PI / 2;
      leftTrail.position.set(-11.5, -0.1, -12);
      jet.add(leftTrail);

      const rightTrail = new THREE.Mesh(trailGeom, trailMat);
      rightTrail.rotation.x = Math.PI / 2;
      rightTrail.position.set(11.5, -0.1, -12);
      jet.add(rightTrail);

      jet.scale.set(scale, scale, scale);
      jet.userData = { afterburners: afterburnerGroup, leftTrail, rightTrail };
      return jet;
    };

    // ========================================================
    // 5. MODEL BUILDER: MILITARY ATTACK HELICOPTER
    // ========================================================
    const buildAttackHelicopter = () => {
      const heli = new THREE.Group();

      // Cockpit / Main Fuselage
      const heliBodyGeom = new THREE.BoxGeometry(2.2, 2.5, 9.5);
      const heliBody = new THREE.Mesh(heliBodyGeom, jetDarkMat);
      heli.add(heliBody);

      // Tandem Cockpit Glazing
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 3.6), canopyMat);
      canopy.position.set(0, 0.8, 2.6);
      heli.add(canopy);

      // Chin FLIR turret & 30mm cannon
      const chinTurret = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 12), jetDarkMat);
      chinTurret.position.set(0, -1.2, 4.4);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8), jetDarkMat);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, -1.3, 5.2);
      heli.add(chinTurret);
      heli.add(barrel);

      // Tail Boom & Angled Fin
      const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.7, 8.5, 8), jetDarkMat);
      boom.rotation.x = Math.PI / 2;
      boom.position.set(0, 0.4, -8.2);
      heli.add(boom);

      const vFin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.4, 1.6), jetDarkMat);
      vFin.position.set(0, 1.4, -12.2);
      heli.add(vFin);

      // Tail Rotor (spinning)
      const tailRotor = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 0.25), jetBodyMat);
      tailRotor.position.set(0.35, 1.6, -12.2);
      heli.add(tailRotor);

      // Stub Wings with Rocket Pods
      const stubWing = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.25, 1.4), jetDarkMat);
      stubWing.position.set(0, -0.2, 0.8);
      heli.add(stubWing);

      // Rocket Pods (left & right)
      [-2.8, 2.8].forEach((x) => {
        const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.2, 12), tankArmorMat);
        pod.rotation.x = Math.PI / 2;
        pod.position.set(x, -0.8, 0.8);
        heli.add(pod);
      });

      // Main Rotor Mast & 4 Blades
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.5, 8), jetDarkMat);
      mast.position.set(0, 1.8, 0.5);
      heli.add(mast);

      const rotorGroup = new THREE.Group();
      rotorGroup.position.set(0, 2.5, 0.5);

      const bladeGeom = new THREE.BoxGeometry(17, 0.06, 0.55);
      const blade1 = new THREE.Mesh(bladeGeom, jetDarkMat);
      rotorGroup.add(blade1);

      const blade2 = new THREE.Mesh(bladeGeom, jetDarkMat);
      blade2.rotation.y = Math.PI / 2;
      rotorGroup.add(blade2);

      // Semi-transparent rotor blur disc for realistic 60fps spin
      const blurDisc = new THREE.Mesh(
        new THREE.CylinderGeometry(8.5, 8.5, 0.02, 24),
        new THREE.MeshBasicMaterial({ color: 0x1E293B, transparent: true, opacity: 0.25 })
      );
      rotorGroup.add(blurDisc);

      heli.add(rotorGroup);

      heli.scale.set(0.85, 0.85, 0.85);
      heli.userData = { mainRotor: rotorGroup, tailRotor };
      return heli;
    };

    // ========================================================
    // 6. MODEL BUILDER: GUIDED MISSILE DESTROYER / FRIGATE
    // ========================================================
    const buildWarshipFrigate = () => {
      const ship = new THREE.Group();

      // Stealth Angular Hull
      const hullGeom = new THREE.BoxGeometry(8, 5.5, 52);
      const hull = new THREE.Mesh(hullGeom, warshipHullMat);
      hull.position.set(0, 1.2, 0);
      ship.add(hull);

      // Raked Knife Bow
      const bowGeom = new THREE.ConeGeometry(4.2, 14, 4);
      const bow = new THREE.Mesh(bowGeom, warshipHullMat);
      bow.rotation.x = Math.PI / 2;
      bow.rotation.y = Math.PI / 4;
      bow.position.set(0, 1.2, 29);
      bow.scale.set(1.0, 1.0, 0.8);
      ship.add(bow);

      // Main Deck & Superstructure
      const deckGeom = new THREE.BoxGeometry(7.6, 0.4, 50);
      const deck = new THREE.Mesh(deckGeom, warshipDeckMat);
      deck.position.set(0, 4.0, 0);
      ship.add(deck);

      // Forward Bridge Deckhouse
      const bridgeGeom = new THREE.BoxGeometry(6.4, 4.2, 12);
      const bridge = new THREE.Mesh(bridgeGeom, warshipHullMat);
      bridge.position.set(0, 6.2, 6);
      ship.add(bridge);

      // Bridge Windows Band
      const windowBand = new THREE.Mesh(
        new THREE.BoxGeometry(6.2, 0.9, 2.5),
        new THREE.MeshBasicMaterial({ color: 0x050C16 })
      );
      windowBand.position.set(0, 7.2, 11.2);
      ship.add(windowBand);

      // Forward Main 76mm Automatic Gun Turret
      const gunBase = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, 1.4, 16), warshipHullMat);
      gunBase.position.set(0, 4.9, 18);
      ship.add(gunBase);

      const gunBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 5.5, 8), warshipHullMat);
      gunBarrel.rotation.x = Math.PI / 2.3;
      gunBarrel.position.set(0, 5.8, 20.8);
      ship.add(gunBarrel);

      // Vertical Launch System (VLS 32-cell missile deck)
      const vlsDeck = new THREE.Mesh(
        new THREE.BoxGeometry(4.5, 0.25, 7.5),
        new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.8 })
      );
      vlsDeck.position.set(0, 4.3, 11);
      ship.add(vlsDeck);

      // Main Radar Mast (AESA Phased Array Pyramidal Mast)
      const mastGeom = new THREE.ConeGeometry(2.2, 8.5, 4);
      const mast = new THREE.Mesh(mastGeom, warshipHullMat);
      mast.rotation.y = Math.PI / 4;
      mast.position.set(0, 11.2, 5);
      ship.add(mast);

      // Rotating Air-Search Radar Antenna on Top of Mast
      const radarAntenna = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 0.6, 0.35),
        new THREE.MeshStandardMaterial({ color: 0xD6AD60, metalness: 0.8 })
      );
      radarAntenna.position.set(0, 15.8, 5);
      ship.add(radarAntenna);

      // Funnel (Engine Exhaust Stack)
      const funnel = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.5, 6), warshipHullMat);
      funnel.position.set(0, 6.2, -4);
      ship.add(funnel);

      // Stern Helicopter Hangar & Flight Deck
      const hangar = new THREE.Mesh(new THREE.BoxGeometry(5.8, 3.4, 10), warshipHullMat);
      hangar.position.set(0, 5.5, -13);
      ship.add(hangar);

      // Flight Deck Helipad with 'H' circle marking
      const helipad = new THREE.Mesh(
        new THREE.BoxGeometry(6.8, 0.15, 12),
        new THREE.MeshStandardMaterial({ color: 0x182430 })
      );
      helipad.position.set(0, 4.15, -20);
      ship.add(helipad);

      // Churning Stern Wake Foam
      const wakeGeom = new THREE.PlaneGeometry(14, 38, 12, 12);
      const wakeMat = new THREE.MeshBasicMaterial({
        color: 0xE2F1FF,
        transparent: true,
        opacity: 0.38,
        wireframe: false,
      });
      const wake = new THREE.Mesh(wakeGeom, wakeMat);
      wake.rotation.x = -Math.PI / 2;
      wake.position.set(0, -0.6, -42);
      ship.add(wake);

      ship.userData = { radar: radarAntenna, gun: gunBase, wake };
      return ship;
    };

    // ========================================================
    // 7. MODEL BUILDER: AIRCRAFT CARRIER (MID-DISTANCE FLAGSHIP)
    // ========================================================
    const buildAircraftCarrier = () => {
      const carrier = new THREE.Group();

      // Flat Flight Deck
      const deckGeom = new THREE.BoxGeometry(22, 1.2, 95);
      const deck = new THREE.Mesh(deckGeom, warshipDeckMat);
      deck.position.set(0, 7.5, 0);
      carrier.add(deck);

      // Angled flight deck runway line
      const runwayLine = new THREE.Mesh(
        new THREE.PlaneGeometry(3.5, 80),
        new THREE.MeshBasicMaterial({ color: 0xE2E8F0, transparent: true, opacity: 0.7 })
      );
      runwayLine.rotation.x = -Math.PI / 2;
      runwayLine.rotation.z = -0.12;
      runwayLine.position.set(-2.5, 8.15, 0);
      carrier.add(runwayLine);

      // Carrier Hull
      const hullGeom = new THREE.BoxGeometry(18, 9, 90);
      const hull = new THREE.Mesh(hullGeom, warshipHullMat);
      hull.position.set(0, 3.5, 0);
      carrier.add(hull);

      // Starboard Island Superstructure
      const islandGeom = new THREE.BoxGeometry(4.2, 8.5, 16);
      const island = new THREE.Mesh(islandGeom, warshipHullMat);
      island.position.set(8.5, 12.5, 2);
      carrier.add(island);

      // Radar Towers on Island
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.8, 8), warshipHullMat);
      mast.position.set(8.5, 19.5, 2);
      carrier.add(mast);

      // Parked Jets on Deck
      [-6, -4, 4].forEach((z, i) => {
        const miniJet = new THREE.Mesh(new THREE.ConeGeometry(0.8, 3.5, 4), jetBodyMat);
        miniJet.rotation.x = Math.PI / 2;
        miniJet.position.set(6.5, 8.5, -20 + i * 8);
        carrier.add(miniJet);
      });

      carrier.scale.set(0.65, 0.65, 0.65);
      return carrier;
    };

    // ========================================================
    // 8. MODEL BUILDER: MAIN BATTLE TANK (ARMY FORCES)
    // ========================================================
    const buildMainBattleTank = () => {
      const tank = new THREE.Group();

      // Lower Hull
      const hullGeom = new THREE.BoxGeometry(5.2, 1.8, 9.5);
      const hull = new THREE.Mesh(hullGeom, tankArmorMat);
      hull.position.set(0, 1.4, 0);
      tank.add(hull);

      // Front Sloped Glacis Plate
      const glacisGeom = new THREE.BoxGeometry(5.2, 1.2, 3.2);
      const glacis = new THREE.Mesh(glacisGeom, tankArmorMat);
      glacis.rotation.x = -0.55;
      glacis.position.set(0, 1.6, 4.8);
      tank.add(glacis);

      // Continuous Tracks (Left & Right)
      [-2.8, 2.8].forEach((x) => {
        const trackGeom = new THREE.BoxGeometry(1.1, 1.6, 10.2);
        const track = new THREE.Mesh(trackGeom, tankTrackMat);
        track.position.set(x, 0.8, 0);
        tank.add(track);

        // 6 Road Wheels per side
        for (let w = -4; w <= 4; w += 1.6) {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.2, 12), tankArmorMat);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(x, 0.6, w);
          tank.add(wheel);
        }
      });

      // Rotating Wedge-Shaped Armored Turret
      const turretGroup = new THREE.Group();
      turretGroup.position.set(0, 2.4, -0.4);

      const turretGeom = new THREE.BoxGeometry(4.2, 1.6, 5.5);
      const turret = new THREE.Mesh(turretGeom, tankArmorMat);
      turretGroup.add(turret);

      // Commander's Cupola & Hatch
      const cupola = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 0.5, 12), tankArmorMat);
      cupola.position.set(1.1, 1.0, -0.8);
      turretGroup.add(cupola);

      // Long 125mm Smoothbore Cannon Barrel with Bore Evacuator
      const barrelGeom = new THREE.CylinderGeometry(0.18, 0.24, 8.5, 12);
      const mainGun = new THREE.Mesh(barrelGeom, tankArmorMat);
      mainGun.rotation.x = Math.PI / 2;
      mainGun.position.set(0, 0.1, 5.8);
      turretGroup.add(mainGun);

      // Muzzle Flash Point & Particle Emitter
      const muzzleFlash = new THREE.PointLight(0xFFB020, 0, 15);
      muzzleFlash.position.set(0, 0.1, 10.2);
      turretGroup.add(muzzleFlash);

      tank.add(turretGroup);
      tank.userData = { turret: turretGroup, muzzleFlash };
      return tank;
    };

    // ========================================================
    // 9. INSTANTIATE VEHICLES & SCENE OBJECTS
    // ========================================================

    // A. 3-JET TACTICAL FORMATION (High Sky Right-to-Left Echelon)
    const formationGroup = new THREE.Group();

    const leadJet = buildFighterJet(0.9, true);
    leadJet.position.set(0, 0, 0);
    formationGroup.add(leadJet);

    const wingmanLeft = buildFighterJet(0.85);
    wingmanLeft.position.set(-14, -2, -12);
    formationGroup.add(wingmanLeft);

    const wingmanRight = buildFighterJet(0.85);
    wingmanRight.position.set(14, -2, -12);
    formationGroup.add(wingmanRight);

    formationGroup.position.set(60, 42, -50);
    scene.add(formationGroup);

    // B. TWO DOGFIGHT INTERCEPTORS (Active Chasing & Evasive Maneuvering)
    const interceptorJet = buildFighterJet(1.15, true);
    interceptorJet.position.set(-25, 22, 10);
    scene.add(interceptorJet);

    const banditJet = buildFighterJet(1.05);
    banditJet.position.set(-15, 26, -5);
    scene.add(banditJet);

    // Dynamic Fired Missile in Mid-Flight
    const activeMissile = new THREE.Group();
    const mBody = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 3.2, 8), missileMat);
    mBody.rotation.x = Math.PI / 2;
    activeMissile.add(mBody);
    const mFlame = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.2, 8), new THREE.MeshBasicMaterial({ color: 0xFFA500 }));
    mFlame.rotation.x = -Math.PI / 2;
    mFlame.position.set(0, 0, -2.2);
    activeMissile.add(mFlame);
    const missileLight = new THREE.PointLight(0xFFA500, 2.5, 25);
    activeMissile.add(missileLight);
    scene.add(activeMissile);

    // C. ATTACK HELICOPTER
    const attackHeli = buildAttackHelicopter();
    attackHeli.position.set(38, 12, 15);
    scene.add(attackHeli);

    // D. NAVAL WARSHIPS & OCEAN
    const frigate = buildWarshipFrigate();
    frigate.position.set(-42, -11, -45);
    frigate.rotation.y = Math.PI / 6;
    scene.add(frigate);

    const carrier = buildAircraftCarrier();
    carrier.position.set(70, -13, -130);
    carrier.rotation.y = -Math.PI / 5;
    scene.add(carrier);

    // Realistic Ocean Surface (Gerstner-style continuous displacement)
    const oceanGeom = new THREE.PlaneGeometry(600, 600, 72, 72);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0A243A,
      roughness: 0.18,
      metalness: 0.85,
      wireframe: false,
    });
    const ocean = new THREE.Mesh(oceanGeom, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.set(0, -14, -80);
    scene.add(ocean);

    // E. ARMY TANKS & COASTAL FORTIFIED RIDGELINE
    const terrainGeom = new THREE.PlaneGeometry(160, 90, 28, 28);
    // Displace vertices to form rugged military dune/ridge
    const tPos = terrainGeom.attributes.position;
    for (let i = 0; i < tPos.count; i++) {
      const px = tPos.getX(i);
      const py = tPos.getY(i);
      const pz = Math.sin(px * 0.05) * 4.5 + Math.cos(py * 0.07) * 3.5;
      tPos.setZ(i, pz);
    }
    terrainGeom.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x1B2A1E,
      roughness: 0.85,
      metalness: 0.2,
      flatShading: true,
    });
    const terrain = new THREE.Mesh(terrainGeom, terrainMat);
    terrain.rotation.x = -Math.PI / 2.2;
    terrain.position.set(45, -16, 25);
    scene.add(terrain);

    // Main Battle Tank 1 advancing on ridge
    const tank1 = buildMainBattleTank();
    tank1.position.set(42, -8.5, 30);
    tank1.rotation.y = -Math.PI / 3;
    scene.add(tank1);

    // Main Battle Tank 2 patrolling lower terrain
    const tank2 = buildMainBattleTank();
    tank2.position.set(58, -9.5, 18);
    tank2.rotation.y = -Math.PI / 2.6;
    tank2.scale.set(0.85, 0.85, 0.85);
    scene.add(tank2);

    // F. VOLUMETRIC HORIZON CLOUDS & COMBAT SMOKE PUFFS
    const cloudGroup = new THREE.Group();
    for (let i = 0; i < 24; i++) {
      const puffGeom = new THREE.DodecahedronGeometry(8 + (i % 4) * 4, 1);
      const puffMat = new THREE.MeshStandardMaterial({
        color: 0x223547,
        roughness: 0.9,
        transparent: true,
        opacity: 0.45,
      });
      const puff = new THREE.Mesh(puffGeom, puffMat);
      puff.position.set(
        (i * 35 - 380),
        15 + (i % 5) * 6,
        -180 + (i % 3) * 30
      );
      cloudGroup.add(puff);
    }
    scene.add(cloudGroup);

    // ========================================================
    // 10. REALISTIC CONTINUOUS ANIMATION LOOP
    // ========================================================
    const clock = new THREE.Clock();
    let animId: number;

    // Mouse parallax drift
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // ----------------------------------------------------
      // A. AERIAL DOGFIGHT KINEMATICS
      // ----------------------------------------------------
      // Lead Interceptor Jet (Sweeps across sky in banking 3D combat curve)
      const interR = 48;
      const interSpeed = 0.52;
      const nextX = Math.sin(time * interSpeed) * interR;
      const nextZ = Math.cos(time * interSpeed) * 38;
      const nextY = 18 + Math.sin(time * 1.1) * 7.5;

      interceptorJet.position.set(nextX, nextY, nextZ);

      // Realistic High-G Banking & Pitch
      const heading = -time * interSpeed - Math.PI / 2;
      interceptorJet.rotation.y = heading;
      interceptorJet.rotation.z = Math.sin(time * 1.1) * 0.72; // Deep 45-70 degree bank
      interceptorJet.rotation.x = Math.cos(time * 1.1) * 0.22; // Pitch up/down

      // Bandit Jet (Chased ahead, executing evasive barrel rolls)
      const banditOffset = 0.35;
      const bX = Math.sin((time + banditOffset) * interSpeed) * (interR + 8);
      const bZ = Math.cos((time + banditOffset) * interSpeed) * 32;
      const bY = 22 + Math.cos(time * 1.4) * 8.5;
      banditJet.position.set(bX, bY, bZ);
      banditJet.rotation.y = -(time + banditOffset) * interSpeed - Math.PI / 2;
      banditJet.rotation.z = Math.sin(time * 2.2) * 1.1; // Aggressive evasive roll
      banditJet.rotation.x = -Math.sin(time * 1.2) * 0.28;

      // Active Missile Chasing Bandit
      const mProg = (time * 1.8) % 6.0;
      activeMissile.position.lerpVectors(interceptorJet.position, banditJet.position, mProg / 6.0);
      activeMissile.lookAt(banditJet.position);

      // Afterburner pulse (flame flicker)
      const pulse = 1.0 + Math.sin(time * 28) * 0.15;
      if (interceptorJet.userData.afterburners) {
        interceptorJet.userData.afterburners.scale.set(pulse, pulse, 1.0 + Math.sin(time * 18) * 0.3);
      }

      // ----------------------------------------------------
      // B. 3-JET FORMATION PATROL
      // ----------------------------------------------------
      formationGroup.position.x = 80 - ((time * 16) % 220);
      formationGroup.position.y = 38 + Math.sin(time * 0.6) * 3;
      formationGroup.rotation.y = -Math.PI / 2 - 0.15;
      formationGroup.rotation.z = Math.sin(time * 0.6) * 0.12;

      // ----------------------------------------------------
      // C. ATTACK HELICOPTER HOVER & PATROL
      // ----------------------------------------------------
      attackHeli.position.x = 36 + Math.sin(time * 0.4) * 10;
      attackHeli.position.z = 18 + Math.cos(time * 0.4) * 8;
      attackHeli.position.y = 12 + Math.sin(time * 1.6) * 1.2;
      attackHeli.rotation.z = -Math.sin(time * 0.4) * 0.18; // banking
      attackHeli.rotation.x = 0.12; // nose-down forward flight pitch

      // Fast rotor blade spin
      if (attackHeli.userData.mainRotor) {
        attackHeli.userData.mainRotor.rotation.y += 0.42;
      }
      if (attackHeli.userData.tailRotor) {
        attackHeli.userData.tailRotor.rotation.x += 0.85;
      }

      // ----------------------------------------------------
      // D. NAVAL WARSHIPS CRUISING & OCEAN SWELLS
      // ----------------------------------------------------
      // Ocean wave vertex displacement (Gerstner wave simulation)
      const oceanPos = oceanGeom.attributes.position;
      for (let i = 0; i < oceanPos.count; i++) {
        const u = oceanPos.getX(i);
        const v = oceanPos.getY(i);
        const z =
          Math.sin(u * 0.04 + time * 1.6) * 1.8 +
          Math.cos(v * 0.05 + time * 1.2) * 1.5 +
          Math.sin((u + v) * 0.02 + time * 0.8) * 1.0;
        oceanPos.setZ(i, z);
      }
      oceanPos.needsUpdate = true;

      // Frigate pitching and rolling with wave swells
      frigate.position.y = -11.5 + Math.sin(time * 1.1) * 0.6;
      frigate.rotation.z = Math.sin(time * 1.2) * 0.04; // Roll
      frigate.rotation.x = Math.cos(time * 0.9) * 0.03; // Pitch
      if (frigate.userData.radar) {
        frigate.userData.radar.rotation.y += 0.045; // 3D radar spin
      }

      // Carrier slow stately cruise
      carrier.position.y = -13.2 + Math.sin(time * 0.7) * 0.35;
      carrier.rotation.z = Math.sin(time * 0.8) * 0.02;

      // ----------------------------------------------------
      // E. MAIN BATTLE TANK TURRET TRAVERSE & MUZZLE
      // ----------------------------------------------------
      if (tank1.userData.turret) {
        tank1.userData.turret.rotation.y = Math.sin(time * 0.6) * 0.55;
      }
      if (tank2.userData.turret) {
        tank2.userData.turret.rotation.y = -Math.sin(time * 0.5) * 0.45;
      }

      // Periodic distant muzzle flash
      const flashTiming = Math.sin(time * 1.2);
      if (tank1.userData.muzzleFlash) {
        tank1.userData.muzzleFlash.intensity = flashTiming > 0.96 ? 8.0 : 0.0;
      }

      // ----------------------------------------------------
      // F. VOLUMETRIC CLOUDS SLOW DRIFT
      // ----------------------------------------------------
      cloudGroup.position.x = ((time * 2.2) % 120);

      // ----------------------------------------------------
      // G. CAMERA VIEW MODES & PARALLAX
      // ----------------------------------------------------
      const currentMode = currentViewRef.current;
      let targetCamX = mouseX * 8;
      let targetCamY = 18 + mouseY * 4;
      let targetCamZ = 95;
      let targetLookAt = new THREE.Vector3(0, 8, 0);

      if (currentMode === 'DOGFIGHT') {
        // Tightly track the active dogfight jets
        targetCamX = interceptorJet.position.x * 0.4 + mouseX * 5;
        targetCamY = interceptorJet.position.y * 0.6 + 6;
        targetCamZ = 70;
        targetLookAt = interceptorJet.position.clone();
      } else if (currentMode === 'FLEET') {
        // Naval Fleet Sea-Level Camera Skim
        targetCamX = frigate.position.x * 0.6 - 15 + mouseX * 5;
        targetCamY = -4 + mouseY * 3;
        targetCamZ = 55;
        targetLookAt = new THREE.Vector3(frigate.position.x, -9, frigate.position.z);
      }

      // Smooth camera damping
      camera.position.x += (targetCamX - camera.position.x) * 0.04;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.position.z += (targetCamZ - camera.position.z) * 0.04;
      camera.lookAt(targetLookAt);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth || window.innerWidth;
      height = containerRef.current.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
