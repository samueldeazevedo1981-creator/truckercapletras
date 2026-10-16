# Trucker Cap Letras v1.4 — teste Guitar Pro — upload próprio

Aplicativo para letras, cifras e partituras em PDF, com identidade amarela, setlists, rolagem e pedal configurável. **Não vem com acervo embutido**: cada cliente cria ou importa suas músicas.

## Publicar no GitHub e na Vercel

1. Extraia o ZIP e envie todos os arquivos e pastas ao GitHub. Esta versão possui menos de 50 arquivos.
2. Na Vercel, importe o repositório GitHub.
3. Use as configurações abaixo. O vercel.json já declara os comandos e a saída.
4. Clique em Deploy.

| Campo | Valor |
|---|---|
| Framework | Other |
| Root Directory | Raiz do repositório: `./` |
| Node.js | 24.x |
| Install Command | `npm ci --ignore-scripts` |
| Build Command | `npm run build` |
| Output Directory | `public` |
| Variáveis de ambiente | Nenhuma |

**Não escolha public como Root Directory.** A raiz deve conter package.json e vercel.json. Envie os arquivos extraídos, não apenas o ZIP fechado.

Para atualizar um site já utilizado, mantenha o mesmo projeto e endereço. Dados de outro domínio/navegador não são transferidos automaticamente: use backup/restauração.

## Usar o aplicativo

- **Nova música:** escrever ou colar letra e cifra.
- **Importar:** selecionar TXT, ChordPro (.cho, .pro, .chordpro) ou PDF. Aceita múltiplos arquivos. ZIP/RAR devem ser extraídos antes.
- **Setlists:** criar listas e ajustar a ordem das músicas.
- **Leitura:** fonte/zoom, rolagem automática, avançar/voltar a leitura e modo palco.
- **Cifras:** os acordes reconhecidos no texto podem ser transpostos; o PDF mantém a escrita original.
- **Backup:** exportar músicas próprias, PDFs e setlists para transferir ou recuperar o repertório.

O repertório inicial fica vazio. Documentos que já estavam baixados pelo app antigo podem aparecer em Arquivos anteriores; não existe novo download de acervo nesta versão. O banco de dados anterior não é apagado.

## Uso off-line

1. No primeiro acesso, mantenha a internet até aparecer **Pronto para uso off-line**.
2. Importe seus documentos e aguarde a mensagem de conclusão.
3. Instale pelo navegador e teste a reabertura em modo avião.
4. Mantenha backups fora do app. Não limpe dados nem desinstale para atualizar.

Os documentos importados ficam no mesmo aparelho e navegador/app em que foram salvos. Primeiro acesso e atualizações precisam de internet. O armazenamento pode ser removido pelo usuário ou pelo sistema; a solicitação de persistência depende do navegador.

## Sistemas previstos

| Sistema | Navegador para instalação e teste |
|---|---|
| Windows | Chrome ou Edge atualizados |
| Mac | Safari ou Chrome atualizados |
| iPhone/iPad | Safari atualizado; Compartilhar → Adicionar à Tela de Início |
| Android | Chrome atualizado |

A instalação e o comportamento completo ainda precisam de validação em aparelhos reais de cada sistema.

## Pedal M-VAVE Cube Turner Plus

Emparelhe pelo Bluetooth do aparelho e escolha um modo de teclado no pedal/CubeSuite. Abra **Configurar pedal**, use **Aprender** para cada botão, escolha as funções e salve.

O padrão é PageUp/PageDown para voltar/avançar a leitura. Também aceita rolagem, troca de música e início do documento. A tela do app precisa estar ativa. Sem internet, mantenha o Bluetooth ligado. O modelo físico ainda precisa de validação nos sistemas atendidos.

## Conferir localmente

Com Node.js 24 instalado, execute na pasta do projeto:

```sh
npm ci --ignore-scripts
npm run build
npm test
npm start
```

Abra http://localhost:4173. Não abra index.html por duplo clique para instalar o modo off-line.

## Arquivos do projeto

- public: aplicativo, ícones e leitor PDF local.
- scripts: verificação, testes e servidor de desenvolvimento.
- tests: testes de cifras, busca, setlists, pedal e simulação do cache off-line.
- package.json / package-lock.json: comandos e configuração.
- vercel.json: publicação estática na Vercel.
- SHA256SUMS.txt: integridade dos arquivos entregues.

Nenhuma dependência npm é necessária para o app funcionar. PDF.js acompanha o pacote; sua licença Apache 2.0 está em public/vendor/PDFJS-LICENSE.txt.

## Testar Guitar Pro

O botão Importar agora aceita .gp, .gpx, .gp3, .gp4 e .gp5 (até 10 MB). Importe o arquivo examples/EXERCICIO_TESTE_GUITAR_PRO.gp incluído neste pacote. Ele é um exercício simples gerado para o teste, sem músicas de terceiros. Você também pode usar seus arquivos reais.

A leitura permite selecionar instrumento e partitura + tablatura, somente partitura ou somente tablatura. Fonte/zoom, rolagem, pedal e modo palco continuam disponíveis. O arquivo original é salvo no navegador e incluído no backup.

Esta versão tem leitura de partitura/tablatura; não inclui reprodução sonora ou edição das notas. A apresentação de alguns efeitos/layouts pode diferir do Guitar Pro original.

O leitor alphaTab 1.8.4 e a fonte musical Bravura fazem parte do pacote e do cache off-line. Não há CDN ou SoundFont remoto para este recurso. Aguarde a atualização e o aviso de preparação off-line antes de desconectar.

Teste em modo avião: importe o exemplo .gp, feche o app completamente e reabra. Confira instrumento, partitura, tablatura e navegação pelo pedal. Teste também exportar/restaurar o backup.

Verificações realizadas: importação de .gp e geração SVG no leitor; partitura, tablatura e perfil combinado; dados inválidos/tamanho máximo; escape de texto; conversão de bytes no backup. Também foi importado/renderizado um arquivo .gp oficial de demonstração com quatro instrumentos. Não houve validação visual/interativa em navegador real nem teste do pedal físico nesta implementação.

Licenças do componente: alphaTab, MPL-2.0, em public/vendor/alphatab/LICENSE.txt; fonte Bravura, SIL OFL, em public/vendor/alphatab/font/Bravura-OFL.txt. O código da biblioteca não foi modificado; alphaTab.core.min.mjs foi apenas renomeado para alphaTab.core.mjs para manter a referência esperada pelo módulo oficial.

Código-fonte do leitor: https://github.com/CoderLine/alphaTab/tree/v1.8.4
Documentação: https://docs.alphatab.net/docs/introduction
