// Mapa de imagens de capa para cada categoria.
// Para trocar uma imagem, basta substituir o arquivo dentro de assets/images
// (mantendo o mesmo nome) ou apontar o require() para um novo arquivo.
//
// OBS: cada require() está isolado em sua própria função "safeRequire".
// Se algum arquivo de imagem estiver com problema de indexação no Snack
// (erro tipo "Unable to resolve module ... .jpg.js"), o app não quebra
// inteiro — só aquela categoria fica sem imagem (undefined), e você verá
// um aviso no console indicando exatamente qual arquivo falhou.

function safeRequire(path, loader) {
  try {
    return loader();
  } catch (error) {
    console.warn(`Falha ao carregar imagem: ${path}`, error?.message);
    return null;
  }
}

export const categoryImages = {
  eletrica: safeRequire('eletrica.jpg', () => require('../assets/images/eletrica.jpg')),
  hidraulica: safeRequire('hidraulica.jpg', () => require('../assets/images/hidraulica.jpg')),
  carro: safeRequire('carro.jpg', () => require('../assets/images/carro.jpg')),
  casa: safeRequire('casa.jpg', () => require('../assets/images/casa.jpg')),
  seguranca: safeRequire('seguranca.jpg', () => require('../assets/images/seguranca.jpg')),
  financas: safeRequire('financas.jpg', () => require('../assets/images/financas.jpg')),
  pet: safeRequire('pet.jpg', () => require('../assets/images/pet.jpg')),
};
