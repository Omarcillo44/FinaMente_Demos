export class Consola {
    constructor() {
        this.outputDiv = document.getElementById('output');
        this.inputLine = document.getElementById('input-line');
        this.inputField = document.getElementById('command-input');
        this.hpBar = document.getElementById('hp-bar');
        this.hpValue = document.getElementById('hp-value');
        this.saldoValue = document.getElementById('saldo-value');
        this.pagoMinimoValue = document.getElementById('pago-minimo-value');
        this.pagoNoInteresesValue = document.getElementById('pago-no-intereses-value');
        this.scoreValue = document.getElementById('score-value');
        this.stageValue = document.getElementById('stage-value');
        this.semanaValue = document.getElementById('semana-value');

        this.inputResolver = null;

        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = this.inputField.value.trim();
                
                if (this.inputResolver) {
                    if (command) {
                        this.print(`> ${command}`, 'user-input');
                    } else {
                        this.print(`> [ENTER]`, 'user-input');
                    }
                    this.inputField.value = '';
                    const resolver = this.inputResolver;
                    this.inputResolver = null;
                    this.inputField.disabled = true;
                    resolver(command);
                }
            }
        });

        // Asegurar que el input recupere el foco al dar clic en cualquier parte
        document.addEventListener('click', () => {
            if (!this.inputField.disabled) {
                this.inputField.focus();
            }
        });
    }

    print(text, styleClass = 'system') {
        const line = document.createElement('div');
        line.className = `line ${styleClass}`;
        line.textContent = text;
        this.outputDiv.appendChild(line);
        this.scrollToBottom();
    }

    clear() {
        this.outputDiv.innerHTML = '';
    }

    scrollToBottom() {
        const container = document.getElementById('console-container');
        container.scrollTop = container.scrollHeight;
    }

    async prompt(message, validOptions = null) {
        if (message) {
            this.print(message, 'prompt');
        }
        
        while (true) {
            this.inputField.disabled = false;
            this.inputField.focus();
            
            const response = await new Promise(resolve => {
                this.inputResolver = resolve;
            });

            if (!validOptions || validOptions.length === 0) {
                return response;
            }

            if (validOptions.includes(response)) {
                return response;
            }

            this.print(`Opción no válida. Opciones válidas: ${validOptions.join(', ')}`, 'error');
        }
    }

    async sleep(ms) {
        // Evitamos retrasos extremos si el usuario cambia de pestaña
        if (document.hidden) {
            return Promise.resolve();
        }
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateHeader(hp, pagoMinimo, pagoNoIntereses, saldo, limite, score, stage, semana) {
        this.hpBar.classList.remove('hidden');
        this.hpValue.textContent = `HP: $${hp.toFixed(2)}`;
        this.saldoValue.textContent = `$${saldo.toFixed(2)} / $${limite.toFixed(2)}`;
        this.pagoMinimoValue.textContent = `$${pagoMinimo.toFixed(2)}`;
        this.pagoNoInteresesValue.textContent = `$${pagoNoIntereses.toFixed(2)}`;
        this.scoreValue.textContent = score.toString();
        this.stageValue.textContent = stage;
        this.semanaValue.textContent = semana;
    }

    hideHeader() {
        this.hpBar.classList.add('hidden');
    }
}
