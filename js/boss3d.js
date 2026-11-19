1.'use strict';

class Boss3DRenderer {
  constructor() {
    this.available = false;
    this.size = 340;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size;
    this.canvas.height = this.size;

    try {
      if (typeof THREE === 'undefined') return;
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(this.size, this.size, false);
      this.renderer.setPixelRatio(1);
      this.renderer.setClearColor(0x000000, 0);

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      this.camera.position.set(0, 0.6, 8.8);
      this.camera.lookAt(0, 0, 0);

      // Мягкое студийное освещение (плюшево-неоновый стиль)
      this.ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      this.scene.add(this.ambientLight);

      this.keyLight = new THREE.DirectionalLight(0xfff5e4, 1.15);
      this.keyLight.position.set(4, 6, 7);
      this.scene.add(this.keyLight);

      this.rimLight = new THREE.PointLight(0xff4d6d, 1.6, 20);
      this.rimLight.position.set(-4, -3, 5);
      this.scene.add(this.rimLight);

      this.rootGroup = new THREE.Group();
      this.scene.add(this.rootGroup);

      this.currentKey = '';
      this.animParts = {};
      this.available = true;
    } catch (e) {
      this.available = false;
    }
  }

  _clearModel() {
    while (this.rootGroup.children.length > 0) {
      const obj = this.rootGroup.children[0];
      this.rootGroup.remove(obj);
      obj.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        }
      });
    }
    this.animParts = {};
  }

  _mat(colorHex, emissiveHex = 0x000000, emissiveInt = 0.25, roughness = 0.35, metalness = 0.15) {
    return new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: emissiveHex,
      emissiveIntensity: emissiveInt,
      roughness,
      metalness
    });
  }

  _buildModel(levelId, isMidBoss) {
    this._clearModel();
    const scaleMult = isMidBoss ? 0.84 : 1.0;
    this.rootGroup.scale.set(scaleMult, scaleMult, scaleMult);

    if (levelId === 1) {
      // УРОВЕНЬ 1: Психоделический Всевидящий Кристалл-Око
      const coreGeo = new THREE.IcosahedronGeometry(1.45, 2);
      const core = new THREE.Mesh(coreGeo, this._mat(0xf72585, 0x7209b7, 0.45, 0.25, 0.3));
      this.rootGroup.add(core);

      const eyeWhite = new THREE.Mesh(
        new THREE.SphereGeometry(0.82, 24, 24),
        this._mat(0xfff8eb, 0xffffff, 0.2, 0.2, 0.0)
      );
      eyeWhite.position.z = 0.95;
      this.rootGroup.add(eyeWhite);

      const pupil = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 20, 20),
        this._mat(0x06d6a0, 0x00f5d4, 0.7, 0.1, 0.2)
      );
      pupil.position.z = 1.55;
      this.rootGroup.add(pupil);

      const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(2.25, 0.13, 14, 48),
        this._mat(0xffbe0b, 0xff9f1c, 0.5, 0.3, 0.5)
      );
      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.7, 0.10, 14, 48),
        this._mat(0x00f5d4, 0x48dbfb, 0.55, 0.3, 0.5)
      );
      ring2.rotation.x = Math.PI / 3;
      this.rootGroup.add(ring1, ring2);

      const orbs = [];
      for (let i = 0; i < 6; i++) {
        const orb = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.32, 0),
          this._mat(i % 2 === 0 ? 0xff006e : 0x80ffdb, 0xffbe0b, 0.4)
        );
        this.rootGroup.add(orb);
        orbs.push(orb);
      }

      this.rimLight.color.setHex(0x00f5d4);
      this.animParts = { core, pupil, ring1, ring2, orbs };
    } else if (levelId === 2) {
      // УРОВЕНЬ 2: Некро-Паук Фиесты (Череп + 8 лап + черепа-спутники)
      const skull = new THREE.Mesh(
        new THREE.SphereGeometry(1.45, 24, 24),
        this._mat(0xfff1e6, 0xff0054, 0.22, 0.35, 0.1)
      );
      skull.scale.set(1.05, 1.12, 0.95);
      this.rootGroup.add(skull);

      const jaw = new THREE.Mesh(
        new THREE.BoxGeometry(1.15, 0.65, 1.0),
        this._mat(0xffe5d9, 0x9b5de5, 0.25, 0.4, 0.1)
      );
      jaw.position.set(0, -1.15, 0.25);
      this.rootGroup.add(jaw);

      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 16), this._mat(0xff002b, 0xffbe0b, 0.9));
      const eyeR = eyeL.clone();
      eyeL.position.set(-0.52, 0.15, 1.25);
      eyeR.position.set(0.52, 0.15, 1.25);
      this.rootGroup.add(eyeL, eyeR);

      const crown = new THREE.Mesh(
        new THREE.ConeGeometry(1.3, 0.9, 6),
        this._mat(0xffbe0b, 0xff006e, 0.5, 0.25, 0.6)
      );
      crown.position.set(0, 1.65, 0);
      this.rootGroup.add(crown);

      const legs = [];
      for (let i = 0; i < 8; i++) {
        const side = i < 4 ? -1 : 1;
        const row = i % 4;
        const legGroup = new THREE.Group();
        const seg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.06, 2.2, 10),
          this._mat(0x3a0ca3, 0xf72585, 0.45, 0.3, 0.4)
        );
        seg.position.set(side * 1.1, -0.3, 0);
        seg.rotation.z = side * (0.65 + row * 0.22);
        legGroup.add(seg);
        legGroup.position.set(side * 0.9, 0.3 - row * 0.35, -0.2);
        this.rootGroup.add(legGroup);
        legs.push({ group: legGroup, side, row });
      }

      this.rimLight.color.setHex(0xff0054);
      this.animParts = { skull, jaw, eyeL, eyeR, crown, legs };
    } else if (levelId === 3) {
      // УРОВЕНЬ 3: Плюшевый Торт-Левиафан со свечами и пончиками
      const baseTier = new THREE.Mesh(
        new THREE.CylinderGeometry(1.9, 2.05, 1.15, 28),
        this._mat(0xff70a6, 0xff0a54, 0.25, 0.45, 0.05)
      );
      baseTier.position.y = -0.65;

      const midTier = new THREE.Mesh(
        new THREE.CylinderGeometry(1.4, 1.5, 0.95, 28),
        this._mat(0xffd670, 0xff9770, 0.25, 0.4, 0.05)
      );
      midTier.position.y = 0.35;

      const creamRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.92, 0.22, 12, 32),
        this._mat(0xfff8eb, 0xffc2d1, 0.2, 0.3, 0.0)
      );
      creamRing.rotation.x = Math.PI / 2;
      creamRing.position.y = -0.05;

      this.rootGroup.add(baseTier, midTier, creamRing);

      const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), this._mat(0x120826, 0x00f5d4, 0.4));
      const eyeR = eyeL.clone();
      eyeL.position.set(-0.55, -0.55, 1.85);
      eyeR.position.set(0.55, -0.55, 1.85);
      this.rootGroup.add(eyeL, eyeR);

      const candles = [];
      [-0.75, 0, 0.75].forEach((cx) => {
        const cGroup = new THREE.Group();
        const stick = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.11, 0.85, 12),
          this._mat(0x70d6ff, 0x00bbf9, 0.3)
        );
        const flame = new THREE.Mesh(
          new THREE.ConeGeometry(0.18, 0.42, 12),
          this._mat(0xffbe0b, 0xff5400, 0.95)
        );
        flame.position.y = 0.6;
        cGroup.add(stick, flame);
        cGroup.position.set(cx, 1.2, 0);
        this.rootGroup.add(cGroup);
        candles.push(flame);
      });

      this.rimLight.color.setHex(0xff70a6);
      this.animParts = { baseTier, midTier, candles };
    } else if (levelId === 4) {
      // УРОВЕНЬ 4: Глубоководный Плазменный Кракен
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(1.65, 26, 26),
        this._mat(0x3a0ca3, 0x4cc9f0, 0.42, 0.22, 0.25)
      );
      dome.scale.set(1.0, 1.25, 0.95);
      dome.position.y = 0.45;
      this.rootGroup.add(dome);

      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 20, 20),
        this._mat(0xfee440, 0xff9f1c, 0.8, 0.15, 0.1)
      );
      eye.position.set(0, 0.35, 1.45);
      this.rootGroup.add(eye);

      const tentacles = [];
      for (let i = 0; i < 6; i++) {
        const ang = ((i - 2.5) / 2.5) * 1.1;
        const tGroup = new THREE.Group();
        const tent = new THREE.Mesh(
          new THREE.ConeGeometry(0.28, 2.3, 14),
          this._mat(0xf72585, 0x7209b7, 0.45, 0.3, 0.2)
        );
        tent.rotation.x = Math.PI;
        tent.position.y = -1.1;
        tGroup.add(tent);
        tGroup.position.set(Math.sin(ang) * 1.35, -0.65, Math.cos(ang) * 0.4);
        tGroup.rotation.z = Math.sin(ang) * 0.45;
        this.rootGroup.add(tGroup);
        tentacles.push({ group: tGroup, idx: i });
      }

      this.rimLight.color.setHex(0x4cc9f0);
      this.animParts = { dome, eye, tentacles };
    } else if (levelId === 5) {
      // УРОВЕНЬ 5: Солнечный Лев Джа (Раста-Тотем)
      const head = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.45, 1),
        this._mat(0xff9f1c, 0xffbe0b, 0.4, 0.35, 0.2)
      );
      this.rootGroup.add(head);

      const glassesL = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 0.16, 20),
        this._mat(0x06d6a0, 0x00f5d4, 0.75, 0.15, 0.5)
      );
      glassesL.rotation.x = Math.PI / 2;
      glassesL.position.set(-0.52, 0.2, 1.35);

      const glassesR = glassesL.clone();
      glassesR.material = this._mat(0xff006e, 0xff5964, 0.75, 0.15, 0.5);
      glassesR.position.set(0.52, 0.2, 1.35);
      this.rootGroup.add(glassesL, glassesR);

      const maneRays = [];
      const rastaCols = [0xff0054, 0xffbe0b, 0x06d6a0];
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12;
        const ray = new THREE.Mesh(
          new THREE.ConeGeometry(0.28, 1.35, 10),
          this._mat(rastaCols[i % 3], rastaCols[i % 3], 0.45)
        );
        ray.position.set(Math.cos(a) * 2.15, Math.sin(a) * 2.15, -0.35);
        ray.rotation.z = a - Math.PI / 2;
        this.rootGroup.add(ray);
        maneRays.push(ray);
      }

      this.rimLight.color.setHex(0x06d6a0);
      this.animParts = { head, maneRays };
    } else {
      // УРОВЕНЬ 6: Споровый Мухомор-Левиафан
      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(2.05, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.55),
        this._mat(0xff0054, 0x9b5de5, 0.45, 0.3, 0.15)
      );
      cap.position.y = 0.25;
      this.rootGroup.add(cap);

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.85, 1.15, 1.9, 20),
        this._mat(0xf8edeb, 0xc77dff, 0.25, 0.5, 0.05)
      );
      stem.position.y = -0.65;
      this.rootGroup.add(stem);

      const spots = [];
      for (let i = 0; i < 7; i++) {
        const a = (Math.PI * 2 * i) / 7;
        const spot = new THREE.Mesh(
          new THREE.SphereGeometry(0.32, 12, 12),
          this._mat(0xccff33, 0x80ed99, 0.85)
        );
        spot.position.set(Math.cos(a) * 1.45, 0.95, Math.sin(a) * 1.45);
        this.rootGroup.add(spot);
        spots.push(spot);
      }

      const eyes = [];
      [-0.42, 0, 0.42].forEach((ex, idx) => {
        const eMesh = new THREE.Mesh(
          new THREE.SphereGeometry(idx === 1 ? 0.32 : 0.22, 14, 14),
          this._mat(0xffee32, 0xffbe0b, 0.9)
        );
        eMesh.position.set(ex, -0.35 + (idx === 1 ? 0.22 : 0), 1.02);
        this.rootGroup.add(eMesh);
        eyes.push(eMesh);
      });

      this.rimLight.color.setHex(0xccff33);
      this.animParts = { cap, stem, spots, eyes };
    }
  }

  renderBossToCanvas(targetCtx, boss, lvl, player, time) {
    if (!this.available) return false;

    const key = `${lvl.id}_${boss.isMidBoss ? 'mid' : 'mega'}`;
    if (this.currentKey !== key) {
      this._buildModel(lvl.id, boss.isMidBoss);
      this.currentKey = key;
    }

    // Поворот 3D-босса вслед за кораблём игрока и фазами ярости
    const aimX = player ? Math.max(-0.45, Math.min(0.45, (player.x - boss.x) / 320)) : 0;
    const attackKick = boss.attackAnimTimer > 0 ? Math.sin((boss.attackAnimTimer / 0.28) * Math.PI) * 0.25 : 0;
    const phaseMult = boss.phase === 3 ? 2.1 : (boss.phase === 2 ? 1.45 : 1.0);

    this.rootGroup.rotation.y = aimX + Math.sin(time * 1.6 * phaseMult) * 0.16;
    this.rootGroup.rotation.x = 0.18 + Math.cos(time * 2.1) * 0.08 + attackKick;
    this.rootGroup.position.y = Math.sin(time * 3.0) * 0.14;

    // Вспышка при получении урона или переход в 3-ю фазу ярости
    const flash = boss.hitFlash > 0 ? boss.hitFlash : 0;
    this.ambientLight.intensity = 0.85 + flash * 1.8;
    if (boss.phase === 3) {
      this.rimLight.intensity = 2.4 + Math.sin(time * 16) * 0.9;
    }

    // Анимация подвижных частей конкретной 3D-модели
    const p = this.animParts;
    if (p.ring1 && p.ring2) {
      p.ring1.rotation.z = time * 1.4 * phaseMult;
      p.ring1.rotation.y = time * 0.9;
      p.ring2.rotation.z = -time * 1.8 * phaseMult;
      p.pupil.position.x = aimX * 0.6;
      if (p.orbs) {
        p.orbs.forEach((orb, idx) => {
          const a = time * 2.2 * phaseMult + (Math.PI * 2 * idx) / p.orbs.length;
          orb.position.set(Math.cos(a) * 2.45, Math.sin(a) * 1.55, Math.sin(a * 2) * 0.8);
          orb.rotation.y = time * 3;
        });
      }
    } else if (p.legs) {
      p.jaw.position.y = -1.15 - Math.abs(Math.sin(time * 5 * phaseMult)) * 0.24 - attackKick * 0.5;
      p.crown.rotation.y = time * 2.0;
      p.legs.forEach((l) => {
        l.group.rotation.z = Math.sin(time * 6 * phaseMult + l.row) * 0.22 * l.side;
      });
    } else if (p.candles) {
      p.midTier.rotation.y = time * 1.2 * phaseMult;
      p.baseTier.rotation.y = -time * 0.7;
      p.candles.forEach((fl, idx) => {
        const s = 1 + Math.sin(time * 14 + idx) * 0.25;
        fl.scale.set(s, s * 1.2, s);
      });
    } else if (p.tentacles) {
      p.dome.scale.x = 1 + Math.sin(time * 4 * phaseMult) * 0.08;
      p.tentacles.forEach((t) => {
        t.group.rotation.x = Math.sin(time * 4.5 * phaseMult + t.idx) * 0.35;
      });
    } else if (p.maneRays) {
      p.head.rotation.z = Math.sin(time * 2.5) * 0.15;
      p.maneRays.forEach((ray, idx) => {
        const pulse = 1 + Math.sin(time * 8 * phaseMult + idx) * 0.22;
        ray.scale.set(1, pulse, 1);
      });
    } else if (p.cap && p.spots) {
      p.cap.rotation.y = time * 1.1 * phaseMult;
      p.spots.forEach((sp, idx) => {
        const s = 1 + Math.sin(time * 7 + idx) * 0.2;
        sp.scale.set(s, s, s);
      });
    }

    this.renderer.render(this.scene, this.camera);

    const drawSize = boss.r * 3.7;
    targetCtx.drawImage(this.canvas, boss.x - drawSize / 2, boss.y - drawSize / 2, drawSize, drawSize);
    return true;
  }
}

const boss3DEngine = new Boss3DRenderer();

