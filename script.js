document.addEventListener('DOMContentLoaded', () => {
    const btnAlert = document.getElementById('btnAlert');
    const btnScanQRCode = document.getElementById('btnScanQRCode');
    const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));

    btnAlert.addEventListener('click', () => {
        alert('Botão clicado!');
    });

    btnScanQRCode.addEventListener('click', () => {
        // Iniciar a leitura do QR code
        Html5Qrcode.getCameras().then(devices => {
            const cameraId = devices[0].id; // Usar a primeira câmera disponível
            const html5QrCode = new Html5Qrcode("reader");
            
            html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                qrCodeMessage => {
                    // Parar a leitura da câmera
                    html5QrCode.stop().then(() => {
                        // Exibir o modal com informações
                        openUpdateModal(qrCodeMessage);
                    }).catch(err => {
                        console.log(`Erro ao parar a câmera: ${err}`);
                    });
                },
                errorMessage => {
                    // Mensagens de erro
                    console.log(`Erro de leitura: ${errorMessage}`);
                }
            ).catch(err => {
                console.log(`Erro ao iniciar a câmera: ${err}`);
            });
        }).catch(err => {
            console.log(`Erro ao obter câmeras: ${err}`);
        });
    });

    function openUpdateModal(patrimonioId) {
        // Encontrar o patrimônio pelo ID e preencher o modal
        const dadosPatrimonio = [
            ["304", "MESA EM FORMA REDONDA - MESA PARA REUNIÕES", "31/12/2012", "2006/900000", "040205000000 - CS/RTR/UFGD", "SECRETARIA", "040205000000 - CS/RTR/UFGD", "SECRETARIA", "", "3582461", "Bom", "SIM", ""],
            ["328", "MICROCOMPUTADOR NOTEBOOK ITAUTEC - MODELO N8610 DUAL CORE, HD 80 GB, MEM, 512MB", "13/2/2007", "2006/900500", "040205000000 - CS/RTR/UFGD", "DISEL/CCS", "040205030000 - DISEL/CCS/RTR", "DISEL/CCS", "", "3582461", "Ocioso", "SIM", ""],
            ["928", "REFRIGERADOR 280 LITROS MARCA ELECTROLUX - MARCA ELECTROLUX", "25/1/2007", "2006/900271", "040205000000 - CS/RTR/UFGD", "DILOG", "040205000000 - CS/RTR/UFGD", "DEPÓSITO", "", "3582461", "Bom", "SIM", ""],
            ["1095", "PURIFICADOR DE ÁGUA - MARCA BABY SOFT", "23/1/2007", "2006/900276", "040205010000 - CS - NÃO ENCONTRADOS", "", "040205010000 - CS - NÃO ENCONTRADOS", "", "", "", "Não Encontrado", "", ""],
            ["1512", "VENTILADOR DE TETO - VENTILADOR TETO SALA 607 UNID. I", "31/12/2012", "2006/900000", "040205010000 - CS - NÃO ENCONTRADOS", "", "040205010000 - CS - NÃO ENCONTRADOS", "", "", "", "Não Encontrado", "", ""],
            ["2826", "CADEIRA ESTOFADA PÉ TIPO PALITO - COR PRETA", "11/1/2007", "2006/900275", "040205000000 - CS/RTR/UFGD", "SECRETARIA", "040205000000 - CS/RTR/UFGD", "SECRETARIA", "Thiago Leandro Vieira Cavalcante", "3582461", "Bom", "SIM", ""],
            ["2949", "CADEIRA ESTOFADA PÉ TIPO PALITO - COR PRETA", "11/1/2007", "2006/900275", "040205000000 - CS/RTR/UFGD", "COORDENAÇÃO", "040205000000 - CS/RTR/UFGD", "COORDENADORIA", "Thiago Leandro Vieira Cavalcante", "3582461", "Bom", "SIM", ""],
            ["3163", "MESA RETA SEM GAVETA MEDINDO 1,20 X 0,75 CM - MED. 1,20 X 0,75", "31/12/2012", "2006/900000", "040205000000 - CS/RTR/UFGD", "DISEL/CCS", "040205030000 - DISEL/CCS/RTR", "DISEL/CCS", "Thiago Leandro Vieira Cavalcante", "3582461", "Bom", "SIM", ""]
        ];

        const patrimonio = dadosPatrimonio.find(p => p[0] === patrimonioId);
        
        if (patrimonio) {
            document.getElementById('patrimonio').value = patrimonio[0];
            document.getElementById('descricao').value = patrimonio[1];
            document.getElementById('incorporacao').value = patrimonio[2];
            // Preencher outros campos conforme necessário
            // ...
            updateModal.show();
        } else {
            alert('Patrimônio não encontrado.');
        }
    }
});
