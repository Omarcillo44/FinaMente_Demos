export class Consola {
    constructor() {
        this.outputDiv = document.getElementById('output');
        this.inputLine = document.getElementById('input-line');
        this.inputField = document.getElementById('command-input');
        this.hpBar = document.getElementById('hp-bar');
        this.hpValue = document.getElementById('hp-value');
        this.saldoValue = document.getElementById('saldo-value');
        this.efectivoValue = document.getElementById('efectivo-value');

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
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateHeader(hp, saldo, limite, efectivo, cv, stage, semana) {
        this.hpBar.classList.remove('hidden');
        this.hpValue.textContent = `HP/Libre: $${hp.toFixed(2)} | CV: ${cv !== undefined ? Math.floor(cv) : 50}/100`;
        this.saldoValue.textContent = `$${saldo.toFixed(2)} / $${limite.toFixed(2)}`;
        this.efectivoValue.textContent = `$${efectivo.toFixed(2)}`;
        this.stageValue.textContent = stage;
        this.semanaValue.textContent = semana;
    }

    hideHeader() {
        this.hpBar.classList.add('hidden');
    }
}
