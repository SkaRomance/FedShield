#!/usr/bin/env bash
# ==============================================================================
# FedShield - Script di Deploy Automatico su VPS Ubuntu (IONOS / Hetzner / OVH)
# ==============================================================================
set -e

echo "=========================================================="
echo "🛡️  Avvio installazione / aggiornamento FedShield su VPS"
echo "=========================================================="

APP_DIR="/opt/fedshield"
REPO_URL="https://github.com/SkaRomance/FedShield.git"

# 1. Verifica permessi di root
if [ "$(id -u)" -ne 0 ]; then
   echo "❌ Questo script deve essere eseguito come root (usa sudo o accedi come root)."
   exit 1
fi

# 2. Verifica / Installazione Docker & Docker Compose
if ! command -v docker &> /dev/null; then
    echo "📦 Installazione Docker..."
    apt-get update
    apt-get install -y ca-certificates curl gnupg git
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    systemctl enable --now docker
    echo "✅ Docker installato correttamente."
else
    echo "✅ Docker è già presente sul sistema."
fi

# 3. Clone o Aggiornamento repository
if [ ! -d "$APP_DIR" ]; then
    echo "📥 Clonazione repository FedShield in $APP_DIR..."
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
else
    echo "🔄 Repository esistente trovato in $APP_DIR. Aggiornamento in corso..."
    cd "$APP_DIR"
    git fetch origin
    git checkout main
    git pull origin main
fi

# 4. Configurazione .env
if [ ! -f "$APP_DIR/.env" ]; then
    echo "📝 Generazione file .env..."
    cp "$APP_DIR/.env.vps.example" "$APP_DIR/.env"
    RANDOM_SECRET=$(openssl rand -hex 32 2>/dev/null || date +%s%N | sha256sum | head -c 64)
    sed -i "s/genera_qui_un_segreto_lungo_e_casuale_per_jwt_auth_2026/$RANDOM_SECRET/g" "$APP_DIR/.env"
fi

# 5. Build e Avvio dei container
echo "🏗️  Compilazione e avvio dei container Docker (Backend + Nginx Web)..."
docker compose -f docker-compose.vps.yml down --remove-orphans || true
docker compose -f docker-compose.vps.yml up -d --build

# 6. Attendi che i container siano pronti
echo "⏳ Verifica stato dei servizi..."
sleep 5
docker compose -f docker-compose.vps.yml ps

IP=$(curl -s https://api.ipify.org || hostname -I | awk '{print $1}')

echo "=========================================================="
echo "🎉 DEPLOY COMPLETATO CON SUCCESSO!"
echo "=========================================================="
echo "L'interfaccia di FedShield è attiva e raggiungibile su:"
echo "👉 http://${IP}:8080"
echo ""
echo "Credenziali di accesso predefinite:"
echo "• Amministratore: admin@fedshield.local / fedshield123"
echo "• Consulente:    senior@fedshield.local / fedshield123"
echo "=========================================================="
