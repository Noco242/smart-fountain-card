/* =========================================================
   TEIL 1: DIE HAUPTKARTE (Das Design)
   ========================================================= */
class SmartFountainCard extends HTMLElement {
  set hass(hass) {
    if (!this.card) {
      this.card = document.createElement('ha-card');
      this.card.style.cursor = 'pointer';
      this.card.style.overflow = 'hidden';
      this.card.style.borderRadius = 'var(--bubble-button-border-radius, var(--bubble-border-radius, 50px))';
      this.card.style.background = 'var(--bubble-button-background-color, var(--ha-card-background, #2b2b2b))';
      this.card.style.border = 'none';
      this.card.style.boxShadow = 'none';
      
      this.card.style.height = '50px'; 
      this.card.style.width = '100%';
      this.card.style.boxSizing = 'border-box';
      this.card.style.margin = '0';
      this.card.style.padding = '0';

      this.content = document.createElement('div');
      this.content.style.height = '100%';
      this.content.style.width = '100%';
      this.content.style.padding = '0 14px'; 
      this.content.style.display = 'flex';
      this.content.style.alignItems = 'center';
      this.content.style.gap = '14px'; 
      this.content.style.boxSizing = 'border-box';

      const name = this.config.name || 'Wandbrunnen';
      
      this.content.innerHTML = `
        <div class="icon-container" style="width: 40px; height: 40px; border-radius: 50%; background: var(--bubble-icon-background-color, rgba(0, 0, 0, 0.4)); display: flex; justify-content: center; align-items: center; position: relative; flex-shrink: 0;">
           <svg viewBox="0 0 24 24" width="22" height="22">
             <rect x="6" y="2" width="12" height="16" rx="3" fill="var(--primary-text-color)" opacity="0.15"/>
             <path d="M3 15h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2z" fill="var(--primary-text-color)" opacity="0.7"/>
             <g class="water-group">
                <rect class="water-pill pill-1" x="10.5" y="4" width="3" height="6" rx="1.5" fill="#00bfff" />
                <rect class="water-pill pill-2" x="10.5" y="4" width="3" height="6" rx="1.5" fill="#00bfff" />
             </g>
           </svg>
        </div>
        <div class="info" style="display: flex; flex-direction: column; justify-content: center; line-height: 1.2;">
          <div style="font-weight: 600; font-size: 14px; color: var(--primary-text-color); margin-bottom: 2px;">${name}</div>
          <div class="state-text" style="font-size: 12px; color: var(--secondary-text-color);">Lädt...</div>
        </div>
      `;

      const style = document.createElement('style');
      style.textContent = `
        .water-pill {
          opacity: 0;
          transform-origin: center;
        }

        .is-on .pill-1 { animation: floatDown 1.5s infinite ease-in; }
        .is-on .pill-2 { animation: floatDown 1.5s infinite ease-in; animation-delay: 0.75s; }
        
        .is-on .icon-container { 
          background: rgba(0, 191, 255, 0.1) !important; 
          transition: background 0.4s;
        }

        @keyframes floatDown {
          0% { transform: translateY(-2px) scaleY(0.5); opacity: 0; }
          20% { transform: translateY(2px) scaleY(1.2); opacity: 1; }
          80% { transform: translateY(10px) scaleY(1); opacity: 1; }
          100% { transform: translateY(12px) scaleY(0.5); opacity: 0; }
        }
      `;

      this.card.appendChild(style);
      this.card.appendChild(this.content);
      this.appendChild(this.card);

      this.card.addEventListener('click', () => {
        hass.callService('switch', 'toggle', { entity_id: this.config.entity });
      });
    }

    const entityId = this.config.entity;
    const stateObj = hass.states[entityId];
    
    if (stateObj) {
      const isAn = stateObj.state === 'on';
      const textElement = this.content.querySelector('.state-text');
      
      if (isAn) {
        this.card.classList.add('is-on');
        textElement.innerText = 'Wasser fließt';
      } else {
        this.card.classList.remove('is-on');
        textElement.innerText = 'Aus';
      }
    }
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Du musst eine entity angeben.');
    }
    this.config = config;
  }
}

customElements.define('smart-fountain-card', SmartFountainCard);

/* =========================================================
   TEIL 2: DER VISUELLE EDITOR
   ========================================================= */
class SmartFountainCardEditor extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
    const entityPicker = this.querySelector('ha-entity-picker');
    if (entityPicker) {
      entityPicker.hass = hass;
    }
  }

  setConfig(config) {
    this.config = config;
    if (!this.content) {
      this.render();
    }
  }

  render() {
    this.content = document.createElement('div');
    
    this.content.innerHTML = `
      <div style="margin-top: 16px;">
        <ha-entity-picker
          label="Entität (Steckdose für den Brunnen)"
          allow-custom-entity
          hide-clear-icon
          value="${this.config.entity || ''}"
        ></ha-entity-picker>
      </div>
      <div style="margin-top: 16px;">
        <ha-textfield
          label="Name (Optional)"
          value="${this.config.name || ''}"
        ></ha-textfield>
      </div>
    `;

    const entityPicker = this.content.querySelector('ha-entity-picker');
    if (this._hass) {
      entityPicker.hass = this._hass;
    }

    entityPicker.addEventListener('value-changed', (ev) => {
      this.updateConfig('entity', ev.detail.value);
    });

    const nameField = this.content.querySelector('ha-textfield');
    nameField.addEventListener('input', (ev) => {
      this.updateConfig('name', ev.target.value);
    });

    this.appendChild(this.content);
  }

  updateConfig(key, value) {
    if (!this.config) return;
    const newConfig = { ...this.config, [key]: value };
    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

customElements.define('smart-fountain-card-editor', SmartFountainCardEditor);

/* =========================================================
   TEIL 3: HOME ASSISTANT REGISTRIERUNG
   ========================================================= */
window.customCards = window.customCards || [];
window.customCards.push({
  type: "smart-fountain-card",
  name: "Smart Fountain Card",
  preview: true, 
  description: "Eine minimalistische, Bubble Card inspirierte Karte für Wandbrunnen."
});

customElements.get('smart-fountain-card').getConfigElement = function() {
  return document.createElement("smart-fountain-card-editor");
};

customElements.get('smart-fountain-card').getStubConfig = function() {
  return { entity: "", name: "Wandbrunnen" };
};