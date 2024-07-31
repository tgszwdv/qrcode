import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBnV0YfzDGy0z4i_1L2B90Ma0uG4iSja1Q",
    authDomain: "escola-100bf.firebaseapp.com",
    databaseURL: "https://escola-100bf-default-rtdb.firebaseio.com",
    projectId: "escola-100bf",
    storageBucket: "escola-100bf.appspot.com",
    messagingSenderId: "643564475769",
    appId: "1:643564475769:web:3cb893713c956db74b0ba8",
    measurementId: "G-8NKBPQKC65"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const scanQRCodeBtn = document.getElementById('scanQRCode');
    const searchPatrimonioBtn = document.getElementById('searchPatrimonio');
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    const readerElement = document.getElementById('reader');

  

    scanQRCodeBtn.addEventListener('click', () => {
        readerElement.style.display = 'block';
        startQRCodeScanner();
    });

    searchPatrimonioBtn.addEventListener('click', () => {
        const patrimonio = prompt('Digite o número do patrimônio:');
        if (patrimonio) {
            openEditModal(patrimonio);
        }
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
    
                    // Adiciona a classe baseada no valor de atualizado
                    const updatedClass = patrimonio.atualizado ? 'updated-true' : 'updated-false';
                    row.className = updatedClass; // Define a classe para a linha da tabela
    
                    row.innerHTML = `
                        <td>${patrimonio.atualizado ? 'Sim' : 'Não'}</td>
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

    function openEditModal(patrimonio) {
        const dbRef = ref(database, 'patrimonios/' + patrimonio);
        get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const patrimonioData = snapshot.val();

                // Verifica se os elementos existem antes de tentar definir os valores
                document.getElementById('editQrCode').value = patrimonioData.qr_code || '';
                document.getElementById('editPatrimonio').value = patrimonioData.patrimonio || '';
                document.getElementById('editDescricao').value = patrimonioData.descricao || '';
                document.getElementById('editEmpenho').value = patrimonioData.empenho || '';
                document.getElementById('editLotacaoAtual').value = patrimonioData.lotacao_atual || '';
                document.getElementById('editLotacaoCorreta').value = patrimonioData.lotacao_correta || '';
                document.getElementById('editResponsavel').value = patrimonioData.responsavel || '';
                document.getElementById('editEstadoBem').value = patrimonioData.estado_bem || '';
                document.getElementById('editEtiqueta').value = patrimonioData.etiqueta || '';
                document.getElementById('editObservacao').value = patrimonioData.observacao || '';
                document.getElementById('editAtualizado').value = patrimonioData.atualizado ? 'sim' : 'não';

                editModal.show();
            } else {
                console.log("No data available for patrimônio:", patrimonio);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    // Função que deve ser acessível globalmente para ser chamada pelo botão
    window.saveChanges = function() {
        const qrCode = document.getElementById('editQrCode').value;
        const updatedData = {
            qr_code: document.getElementById('editQrCode').value,
            patrimonio: document.getElementById('editPatrimonio').value,
            descricao: document.getElementById('editDescricao').value,
            empenho: document.getElementById('editEmpenho').value,
            lotacao_atual: document.getElementById('editLotacaoAtual').value,
            lotacao_correta: document.getElementById('editLotacaoCorreta').value,
            responsavel: document.getElementById('editResponsavel').value,
            estado_bem: document.getElementById('editEstadoBem').value,
            etiqueta: document.getElementById('editEtiqueta').value,
            observacao: document.getElementById('editObservacao').value,
            atualizado: document.getElementById('editAtualizado').value === 'sim' // Convertendo para booleano
        };

        const dbRef = ref(database, 'patrimonios/' + qrCode);
        set(dbRef, updatedData).then(() => {
            console.log("Data updated successfully.");
            editModal.hide(); // Fechar o modal após salvar
            fetchPatrimonios(); // Atualizar a tabela após salvar
        }).catch((error) => {
            console.error("Error updating data: ", error);
        });
    };

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
