import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDbhOeUDXHmLTUeBgTVu2CoRxGDI-xhJwc",
    authDomain: "teste-ad0e8.firebaseapp.com",
    databaseURL: "https://teste-ad0e8-default-rtdb.firebaseio.com",
    projectId: "teste-ad0e8",
    storageBucket: "teste-ad0e8.appspot.com",
    messagingSenderId: "685260421032",
    appId: "1:685260421032:web:75730b9ea455344cd3cf9d",
    measurementId: "G-38TYZ998NX"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const btnAlert = document.getElementById('btnAlert');
    const scanQRCodeBtn = document.getElementById('scanQRCode');
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    const readerElement = document.getElementById('reader');

    btnAlert.addEventListener('click', () => {
        alert('Botão clicado!');
    });

    scanQRCodeBtn.addEventListener('click', () => {
        readerElement.style.display = 'block';
        startQRCodeScanner();
    });

    function startQRCodeScanner() {
        const html5QrCode = new Html5Qrcode("reader");

        html5QrCode.start(
            { facingMode: "environment" }, // Configuração para usar a câmera traseira
            {
                fps: 10, // Taxa de quadros por segundo
                qrbox: 250 // Tamanho da caixa de QR code
            },
            (decodedText, decodedResult) => {
                // A leitura do QR code foi bem-sucedida
                html5QrCode.stop().then(() => {
                    readerElement.style.display = 'none';
                    openEditModal(decodedText); // Usar o texto decodificado como número do patrimônio
                }).catch((err) => {
                    console.error("Erro ao parar a câmera:", err);
                });
            },
            (errorMessage) => {
                // Mensagem de erro de leitura
                console.warn(`QR code não detectado: ${errorMessage}`);
            }
        ).catch((err) => {
            console.error("Erro ao iniciar o scanner:", err);
        });
    }

    function generateQRCode() {
        const qrCodeElements = document.querySelectorAll('.qrcode');
        qrCodeElements.forEach(el => {
            new QRCode(el, {
                text: el.dataset.value,
                width: 100,
                height: 100
            });
        });
    }

    function fetchPatrimonios() {
        const dbRef = ref(database, 'patrimonios');
        get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const patrimonios = snapshot.val();
                const tableBody = document.querySelector('#patrimonio-table tbody');
                tableBody.innerHTML = '';

                for (let id in patrimonios) {
                    const patrimonio = patrimonios[id];
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td><div class="qrcode" data-value="${patrimonio.patrimonio}"></div></td>
                        <td>${patrimonio.patrimonio}</td>
                        <td>${patrimonio.descricao}</td>
                        <td>${patrimonio.empenho}</td>
                        <td>${patrimonio.lotacao_atual}</td>
                        <td>${patrimonio.lotacao_correta}</td>
                        <td>${patrimonio.responsavel}</td>
                        <td>${patrimonio.estado_bem}</td>
                        <td>${patrimonio.etiqueta}</td>
                        <td>${patrimonio.observacao}</td>
                    `;

                    tableBody.appendChild(row);
                }

                generateQRCode();
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    function openEditModal(qrCode) {
        const dbRef = ref(database, 'patrimonios');
        get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const patrimonios = snapshot.val();
                let found = false;
    
                for (let id in patrimonios) {
                    const patrimonio = patrimonios[id];
                    if (patrimonio.qr_code === qrCode) {
                        // Verifica se os elementos existem antes de tentar definir os valores
                        const fields = ['editQrCode', 'editPatrimonio', 'editDescricao', 'editEmpenho', 'editLotacaoAtual', 'editLotacaoCorreta', 'editResponsavel', 'editEstadoBem', 'editEtiqueta', 'editObservacao'];
                        fields.forEach(field => {
                            const element = document.getElementById(field);
                            if (element) {
                                element.value = patrimonio[field.replace('edit', '').toLowerCase()];
                            } else {
                                console.error(`Element with ID ${field} not found.`);
                            }
                        });
    
                        editModal.show();
                        found = true;
                        break;
                    }
                }
    
                if (!found) {
                    console.log("No data available for QR code:", qrCode);
                }
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    

    function updateTime() {
        const now = new Date();
        const options = {
            timeZone: 'America/Campo_Grande',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        const formatter = new Intl.DateTimeFormat('pt-BR', options);
        document.getElementById('current-time').textContent = formatter.format(now);
    }
    
    setInterval(updateTime, 1000);
    updateTime(); // Atualiza imediatamente na carga da página

    fetchPatrimonios();
});
