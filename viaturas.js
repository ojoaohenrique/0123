/* ===============================================================
   viaturas.js - Sistema Completo com Firebase
   - Autenticação (Login/Logout)
   - Automação de KM via Firestore
   - Integração de Abastecimento
   - Upload de Fotos
   - Feedback Visual
   ===============================================================
*/

document.addEventListener('DOMContentLoaded', function() {
    console.log("Sistema GML carregado!");
    
    // ========== ELEMENTOS DO DOM ==========
    const loginContainer = document.getElementById('loginContainer');
    const mainContainer = document.getElementById('mainContainer');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const userInfo = document.getElementById('userInfo');
    const userEmail = document.getElementById('userEmail');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // ========== AUTENTICAÇÃO FIREBASE ==========
    
    // Monitora estado de autenticação
    auth.onAuthStateChanged(user => {
        if (user) {
            // Usuário logado
            loginContainer.style.display = 'none';
            mainContainer.style.display = 'block';
            userInfo.style.display = 'flex';
            userEmail.textContent = user.email;
            console.log('Usuário logado:', user.email);
            
            // Carrega dados do Firestore
            carregarSaidas();
            carregarAbastecimentos();
        } else {
            // Usuário não logado
            loginContainer.style.display = 'flex';
            mainContainer.style.display = 'none';
            userInfo.style.display = 'none';
            console.log('Usuário não logado');
        }
    });
    
    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Entrando...';
        loginError.style.display = 'none';
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            console.error('Erro no login:', error);
            loginError.textContent = getErrorMessage(error.code);
            loginError.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Entrar';
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error('Erro no logout:', error);
            alert('Erro ao sair: ' + error.message);
        }
    });
    
    // Mensagens de erro em português
    function getErrorMessage(code) {
        const messages = {
            'auth/invalid-email': 'E-mail inválido',
            'auth/user-disabled': 'Usuário desabilitado',
            'auth/user-not-found': 'Usuário não encontrado',
            'auth/wrong-password': 'Senha incorreta',
            'auth/invalid-credential': 'E-mail ou senha incorretos',
            'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde'
        };
        return messages[code] || 'Erro ao fazer login. Tente novamente.';
    }

    // --- SCRIPT PARA REGISTRAR SAÍDA E VOLTA DE VIATURA ---
    const formSaida = document.getElementById('saidaViaturaForm');
    const tabelaSaidasBody = document.getElementById('tabelaSaidasBody');
    const voltaModal = document.getElementById('voltaModal');
    const modalCancelarBtn = document.getElementById('modalCancelarBtn');
    const modalSalvarBtn = document.getElementById('modalSalvarBtn');
    const modalViaturaInfo = document.getElementById('modalViaturaInfo');
    const modalKmChegadaInput = document.getElementById('modalKmChegada');
    const modalRowIdInput = document.getElementById('modalRowId');
    const modalErro = document.getElementById('modalErro');

    // Pega os campos do modal que foram adicionados
    const modalFotoInput = document.getElementById('modalFoto');
    const modalComentariosInput = document.getElementById('modalComentarios');

    // Verifica se os elementos principais existem
    if (!formSaida || !tabelaSaidasBody || !voltaModal || !modalFotoInput || !modalComentariosInput) {
        console.error("ERRO: Elemento essencial (formulário, tabela ou modal) não encontrado. Verifique os IDs no HTML.");
        return; // Para a execução se algo vital faltar
    }

    formSaida.addEventListener('submit', function(e) {
        e.preventDefault();
        const agora = new Date();
        const rowId = 'saida-' + agora.getTime(); // ID único para a linha

        const novaLinha = document.createElement('tr');
        novaLinha.id = rowId;

        // Células com dados da saída
        const dadosSaida = [
            formSaida.viatura.value,
            agora.toLocaleString('pt-BR'),
            formSaida.km_saida.value,
            formSaida.motorista.value,
            formSaida.protocolo.value
        ];
        dadosSaida.forEach(dado => {
            const td = document.createElement('td');
            td.textContent = dado;
            novaLinha.appendChild(td);
        });

        // Células vazias para a chegada
        const kmChegadaCell = document.createElement('td');
        kmChegadaCell.textContent = '-';
        novaLinha.appendChild(kmChegadaCell);

        const kmRodadoCell = document.createElement('td');
        kmRodadoCell.textContent = '-';
        novaLinha.appendChild(kmRodadoCell);

        // Célula da Foto
        const fotoCell = document.createElement('td');
        fotoCell.textContent = '-';
        novaLinha.appendChild(fotoCell);
        
        // Adiciona célula de Observações
        const comentarioCell = document.createElement('td');
        comentarioCell.textContent = '-';
        novaLinha.appendChild(comentarioCell);

        // Célula de Ações com o botão
        const acoesCell = document.createElement('td');
        const btnVolta = document.createElement('button');
        btnVolta.textContent = 'Registrar Volta';
        btnVolta.className = 'btn btn-success btn-volta';
        btnVolta.dataset.rowId = rowId; // Armazena o ID da linha no botão
        acoesCell.appendChild(btnVolta);
        novaLinha.appendChild(acoesCell);

        tabelaSaidasBody.appendChild(novaLinha);
        formSaida.reset();
    });

    // Event listener para abrir o modal (usando delegação de evento)
    tabelaSaidasBody.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('btn-volta')) {
            const rowId = e.target.dataset.rowId;
            const linha = document.getElementById(rowId);
            
            const viatura = linha.cells[0].textContent;
            const kmSaida = linha.cells[2].textContent;

            modalViaturaInfo.textContent = `Viatura: ${viatura} | Km Saída: ${kmSaida}`;
            modalRowIdInput.value = rowId;
            modalKmChegadaInput.value = '';
            modalKmChegadaInput.min = kmSaida; // Impede KM menor que a saída
            modalErro.style.display = 'none';
            
            // Limpa os campos de foto e comentários ao abrir o modal
            modalFotoInput.value = ''; 
            modalComentariosInput.value = '';
            
            voltaModal.style.display = 'flex';
        }
    });

    // Fechar o modal
    modalCancelarBtn.addEventListener('click', () => { voltaModal.style.display = 'none'; });
    voltaModal.addEventListener('click', (e) => {
        if (e.target === voltaModal) { // Fecha somente se clicar no fundo
            voltaModal.style.display = 'none';
        }
    });

    // Salvar os dados do modal
    modalSalvarBtn.addEventListener('click', function() {
        const rowId = modalRowIdInput.value;
        const linha = document.getElementById(rowId);
        
        const kmSaida = parseFloat(linha.cells[2].textContent);
        const kmChegada = parseFloat(modalKmChegadaInput.value);

        // Validação
        if (isNaN(kmChegada) || kmChegada < kmSaida) {
            modalErro.textContent = 'ERRO: O Km de Chegada deve ser maior ou igual ao Km de Saída.';
            modalErro.style.display = 'block';
            return;
        }

        const kmRodado = kmChegada - kmSaida;

        // --- INÍCIO DAS NOVAS ATUALIZAÇÕES ---

        // Atualiza a tabela (células 5 e 6)
        linha.cells[5].textContent = kmChegada;          // Km Chegada
        linha.cells[6].textContent = kmRodado.toFixed(1); // Km Rodado
        
        // Pega as células de foto e comentário (índices 7 e 8)
        const fotoCell = linha.cells[7];
        const comentarioCell = linha.cells[8];

        // 1. Salva o comentário
        comentarioCell.textContent = modalComentariosInput.value || 'Sem observações';
        comentarioCell.style.whiteSpace = 'normal'; // Permite quebra de linha

        // 2. Salva as Fotos (com loop)
        fotoCell.innerHTML = ''; // Limpa o '-'
        fotoCell.style.whiteSpace = 'normal'; // Permite que as fotos quebrem a linha

        if (modalFotoInput.files.length > 0) {
            
            // Loop para cada arquivo selecionado
            for (const file of modalFotoInput.files) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Cria uma imagem (thumbnail)
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.width = '80px'; // Tamanho menor para caber várias
                    img.style.height = '80px';
                    img.style.objectFit = 'cover';
                    img.style.margin = '2px';
                    img.style.cursor = 'pointer';
                    img.style.border = '1px solid #ddd';
                    img.style.borderRadius = '4px';

                    // Cria um link para ver a imagem maior em outra aba
                    const link = document.createElement('a');
                    link.href = e.target.result;
                    link.target = '_blank';
                    link.appendChild(img);
                    
                    fotoCell.appendChild(link); // Adiciona a nova foto na célula
                };
                
                reader.readAsDataURL(file); // Lê o arquivo
            }
        } else {
            fotoCell.textContent = 'Sem Foto';
        }
        
        // --- FIM DAS NOVAS ATUALIZAÇÕES ---
        
        // Atualiza o botão e o estilo da linha (agora na célula 9)
        linha.cells[9].innerHTML = '<button class="btn btn-secondary" disabled>Finalizado</button>';
        linha.classList.add('viagem-finalizada');
        
        // Limpa os inputs do modal e fecha
        modalFotoInput.value = ''; 
        modalComentariosInput.value = '';
        voltaModal.style.display = 'none';
    });


    // --- SCRIPT PARA CÁLCULO E REGISTRO DE ABASTECIMENTO (sem alterações) ---
    const formAbastecimento = document.getElementById("abastecimentoForm");
    const tabelaAbastecimentoBody = document.getElementById("tabelaAbastecimento").querySelector("tbody");

    const kmAbastecimento = document.getElementById("km_abastecimento");
    const kmAtual = document.getElementById("km_atual");
    const litros = document.getElementById("litros");
    const kmRodadoInput = document.getElementById("km_rodado");
    const mediaInput = document.getElementById("media_km_l");

    // Verifica se os elementos de abastecimento existem (para não quebrar)
    if (formAbastecimento) {
        function calcularValores() {
            const km1 = parseFloat(kmAbastecimento.value);
            const km2 = parseFloat(kmAtual.value);
            const litrosVal = parseFloat(litros.value);

            if (!isNaN(km1) && !isNaN(km2) && km2 > km1) {
                const rodado = km2 - km1;
                kmRodadoInput.value = rodado.toFixed(0);
                if (!isNaN(litrosVal) && litrosVal > 0) {
                    mediaInput.value = (rodado / litrosVal).toFixed(2) + " KM/L";
                } else {
                    mediaInput.value = "";
                }
            } else {
                kmRodadoInput.value = "";
                mediaInput.value = "";
            }
        }

        kmAbastecimento.addEventListener("input", calcularValores);
        kmAtual.addEventListener("input", calcularValores);
        litros.addEventListener("input", calcularValores);

        formAbastecimento.addEventListener("submit", function(e) {
            e.preventDefault();
            const novaLinha = document.createElement("tr");
            const dados = [
                formAbastecimento.viatura_abastecimento.value, 
                new Date(formAbastecimento.data_abastecimento.value).toLocaleDateString('pt-BR', {timeZone: 'UTC'}),
                kmAbastecimento.value, 
                kmAtual.value, 
                litros.value, 
                kmRodadoInput.value, 
                mediaInput.value
            ];
            dados.forEach(dado => {
                const td = document.createElement('td');
                td.textContent = dado;
                novaLinha.appendChild(td);
            });
            tabelaAbastecimentoBody.appendChild(novaLinha);
            formAbastecimento.reset();
            kmRodadoInput.value = "";
            mediaInput.value = "";
        });
    }

    // ========== FUNÇÕES FIRESTORE ==========
    
    // Carrega registros de saída do Firestore
    function carregarSaidas() {
        db.collection('saidas')
            .orderBy('dataSaida', 'desc')
            .onSnapshot(snapshot => {
                tabelaSaidasBody.innerHTML = '';
                snapshot.forEach(doc => {
                    const dados = doc.data();
                    adicionarLinhaTabela(doc.id, dados);
                });
            }, error => {
                console.error('Erro ao carregar saídas:', error);
            });
    }
    
    // Adiciona linha na tabela de saídas
    function adicionarLinhaTabela(docId, dados) {
        const novaLinha = document.createElement('tr');
        novaLinha.id = docId;
        
        if (dados.kmChegada) {
            novaLinha.classList.add('viagem-finalizada');
        }
        
        // Células da tabela
        const celulas = [
            dados.viatura,
            new Date(dados.dataSaida.seconds * 1000).toLocaleString('pt-BR'),
            dados.kmSaida,
            dados.motorista,
            dados.protocolo,
            dados.kmChegada || '-',
            dados.kmChegada ? (dados.kmChegada - dados.kmSaida).toFixed(1) : '-'
        ];
        
        celulas.forEach(valor => {
            const td = document.createElement('td');
            td.textContent = valor;
            novaLinha.appendChild(td);
        });
        
        // Célula de fotos
        const fotoCell = document.createElement('td');
        if (dados.fotos && dados.fotos.length > 0) {
            dados.fotos.forEach(url => {
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                const img = document.createElement('img');
                img.src = url;
                img.style.width = '80px';
                img.style.height = '80px';
                img.style.objectFit = 'cover';
                img.style.margin = '2px';
                img.style.border = '1px solid #ddd';
                img.style.borderRadius = '4px';
                link.appendChild(img);
                fotoCell.appendChild(link);
            });
        } else {
            fotoCell.textContent = '-';
        }
        novaLinha.appendChild(fotoCell);
        
        // Célula de observações
        const obsCell = document.createElement('td');
        obsCell.textContent = dados.observacoes || '-';
        obsCell.style.whiteSpace = 'normal';
        novaLinha.appendChild(obsCell);
        
        // Célula de ações
        const acoesCell = document.createElement('td');
        if (dados.kmChegada) {
            acoesCell.innerHTML = '<button class="btn btn-secondary" disabled>Finalizado</button>';
        } else {
            const btnVolta = document.createElement('button');
            btnVolta.textContent = 'Registrar Volta';
            btnVolta.className = 'btn btn-success btn-volta';
            btnVolta.dataset.docId = docId;
            acoesCell.appendChild(btnVolta);
        }
        novaLinha.appendChild(acoesCell);
        
        tabelaSaidasBody.appendChild(novaLinha);
    }
    
    // Carrega abastecimentos do Firestore
    function carregarAbastecimentos() {
        db.collection('abastecimentos')
            .orderBy('dataAbastecimento', 'desc')
            .onSnapshot(snapshot => {
                tabelaAbastecimentoBody.innerHTML = '';
                snapshot.forEach(doc => {
                    const dados = doc.data();
                    const novaLinha = document.createElement('tr');
                    
                    const celulas = [
                        dados.viatura,
                        new Date(dados.dataAbastecimento.seconds * 1000).toLocaleDateString('pt-BR'),
                        dados.kmAbastecimento,
                        dados.kmAtual,
                        dados.litros,
                        dados.kmRodado,
                        dados.media
                    ];
                    
                    celulas.forEach(valor => {
                        const td = document.createElement('td');
                        td.textContent = valor;
                        novaLinha.appendChild(td);
                    });
                    
                    tabelaAbastecimentoBody.appendChild(novaLinha);
                });
            }, error => {
                console.error('Erro ao carregar abastecimentos:', error);
            });
    }

}); // <-- FIM DO document.addEventListener('DOMContentLoaded')