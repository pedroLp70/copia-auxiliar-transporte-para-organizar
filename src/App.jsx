import React, { useState, useEffect } from "react";
import "./App.css";

// Componente principal da calculadora de transporte otimizado para AVATAR
export const TransportCalculator = () => {
  const [distance, setDistance] = useState(0);
  const [urban, setUrban] = useState(true);
  const [animalSize, setAnimalSize] = useState("small");
  const [waitTime, setWaitTime] = useState(0);
  const [destination, setDestination] = useState("");
  const [returnDestination, setReturnDestination] = useState("");
  const [total, setTotal] = useState(0);
  const [details, setDetails] = useState({ ida: 0, volta: 0 });
  const [roundTrip, setRoundTrip] = useState(true); // State para controlar ida e volta
  
  // Origem fixa
  const origin = "Central";

  // Lista de bairros de Manaus
  const neighborhoods = [
    "Adrianópolis",
    "Aleixo",
    "Alvorada",
    "Armando Mendes",
    "Betânia",
    "Cachoeirinha",
    "Centro",
    "Chapada",
    "Cidade de Deus",
    "Cidade Nova",
    "Colônia Antônio Aleixo",
    "Colônia Oliveira Machado",
    "Colônia Santo Antônio",
    "Colônia Terra Nova",
    "Compensa",
    "Coroado",
    "Crespo",
    "Da Paz",
    "Distrito Industrial I",
    "Distrito Industrial II",
    "Dom Pedro",
    "Educandos",
    "Flores",
    "Gilberto Mestrinho",
    "Glória",
    "Japiim",
    "Jorge Teixeira",
    "Lago Azul",
    "Lírio do Vale",
    "Mauazinho",
    "Monte das Oliveiras",
    "Morro da Liberdade",
    "Nossa Senhora Aparecida",
    "Nossa Senhora das Graças",
    "Nova Cidade",
    "Nova Esperança",
    "Novo Aleixo",
    "Novo Israel",
    "Parque 10 de Novembro",
    "Petrópolis",
    "Planalto",
    "Ponta Negra",
    "Praça 14 de Janeiro",
    "Presidente Vargas",
    "Puraquequara",
    "Raiz",
    "Redenção",
    "Santa Etelvina",
    "Santa Luzia",
    "Santo Agostinho",
    "Santo Antônio",
    "São Francisco",
    "São Geraldo",
    "São Jorge",
    "São José Operário",
    "São Lázaro",
    "São Raimundo",
    "Tancredo Neves",
    "Tarumã",
    "Tarumã Açu",
    "Vila Buriti",
    "Vila da Prata",
    "Zumbi dos Palmares"
  ];

  // Função para gerar um objeto de distâncias aleatórias (simulando distâncias reais)
  const generateDistanceMatrix = () => {
    const distanceMatrix = {};
    
    // Para cada bairro, cria distâncias para todos os outros bairros
    neighborhoods.forEach(origin => {
      distanceMatrix[origin] = {};
      neighborhoods.forEach(dest => {
        if (origin === dest) {
          distanceMatrix[origin][dest] = 0;
        } else {
          // Gera uma distância entre 5 e 30 km (valores fictícios)
          // Em uma aplicação real, você usaria distâncias reais ou uma API de mapas
          const distance = Math.round((Math.random() * 25 + 5) * 10) / 10;
          distanceMatrix[origin][dest] = distance;
        }
      });
    });
    
    // Adicionar explicitamente "Central" se não estiver na lista
    if (!distanceMatrix["Central"]) {
      distanceMatrix["Central"] = {};
      neighborhoods.forEach(dest => {
        const distance = Math.round((Math.random() * 25 + 5) * 10) / 10;
        distanceMatrix["Central"][dest] = distance;
      });
    }
    
    // Garantir que todos os bairros tenham distância para "Central"
    neighborhoods.forEach(neighborhood => {
      if (!distanceMatrix[neighborhood]["Central"]) {
        const distance = Math.round((Math.random() * 25 + 5) * 10) / 10;
        distanceMatrix[neighborhood]["Central"] = distance;
      }
    });
    
    return distanceMatrix;
  };

  // Matriz de distâncias entre bairros (seria ideal usar dados reais em produção)
  const distanceMatrix = React.useMemo(() => generateDistanceMatrix(), []);

  // Atualiza a distância quando destino muda
  useEffect(() => {
    if (destination) {
      const calculatedDistance = distanceMatrix[origin][destination];
      setDistance(calculatedDistance);
    }
  }, [destination, distanceMatrix]);

  // Função para obter taxa adicional baseada no tamanho do animal
  const getAnimalSizeFee = (size) => {
    switch(size) {
      case "small": // até 10kg
        return 0;
      case "medium": // 10kg até 22kg
        return 30;
      case "large": // 22kg até 40kg
        return 50;
      case "xlarge": // acima de 40kg
        return 80;
      default:
        return 0;
    }
  };

  // Função para calcular o preço
  const calculatePrice = () => {
    const baseRate = 80.0;
    const uniformRate = 2.37; // Taxa única de 2.37 por km
    const additionalTimeRate = 20.0; // Taxa adicional para tempo de espera
    const animalSizeFee = getAnimalSizeFee(animalSize);

    // Cálculo da ida
    const distanceToDestination = distanceMatrix[origin][destination];
    let priceIda = distanceToDestination * uniformRate;
    if (priceIda < 40.0) {
      priceIda = baseRate;
    }
    if (waitTime > 60) {
      priceIda += additionalTimeRate;
    }
    priceIda += animalSizeFee;

    // Inicializa o preço da volta
    let priceVolta = 0;
    let distanceFromDestination = 0;
    let actualReturnDestination = "";

    // Calcula a volta apenas se for viagem de ida e volta
    if (roundTrip) {
      actualReturnDestination = returnDestination || origin;
      distanceFromDestination = distanceMatrix[destination][actualReturnDestination];
      priceVolta = distanceFromDestination * uniformRate;
      if (priceVolta < 40.0) {
        priceVolta = baseRate;
      }
      priceVolta += animalSizeFee;
    }

    // Atualiza o total e detalhes
    const totalPrice = priceIda + priceVolta;
    setTotal(totalPrice.toFixed(2));
    setDetails({
      ida: priceIda.toFixed(2),
      volta: priceVolta.toFixed(2),
      distanciaIda: distanceToDestination.toFixed(1),
      distanciaVolta: distanceFromDestination.toFixed(1),
      destinoVolta: actualReturnDestination,
      tipoViagem: roundTrip ? "Ida e volta" : "Só ida"
    });
  };

  // Função para redirecionar para o WhatsApp
  const handleSchedule = () => {
    const whatsappLink = "https://api.whatsapp.com/send/?phone=559292520890&text=Oi%2C%20fiz%20a%20simula%C3%A7%C3%A3o%20e%20gostaria%20de%20finalizar%20meu%20agendamento&type=phone_number&app_absent=0";
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-blue-50 rounded-xl shadow-lg space-y-6">
      {/* Título principal com tipografia melhorada e cor mais confiável */}
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-2">Calculadora de Transporte Pet</h1>
      <p className="text-sm text-blue-600 text-center">Calcule o valor da corrida com base nos detalhes do transporte</p>

      {/* Seção principal com campos reorganizados conforme a ordem sugerida */}
      <div className="bg-white p-5 rounded-lg shadow-sm space-y-4">
        {/* 1. DESTINO - Campo prioritário */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-blue-800">Destino:</label>
          <select
            className="w-full border border-blue-200 rounded-lg p-2.5 bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="" className="text-blue-500">Selecione um bairro</option>
            {neighborhoods.map((neighborhood) => (
              <option key={neighborhood} value={neighborhood} className="text-blue-700">
                {neighborhood}
              </option>
            ))}
          </select>
        </div>
        
        {/* 2. TIPO DE VIAGEM */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-blue-800">Tipo de viagem:</label>
          <select
            className="w-full border border-blue-200 rounded-lg p-2.5 bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800"
            value={roundTrip ? "roundtrip" : "oneway"}
            onChange={(e) => {
              const isRoundTrip = e.target.value === "roundtrip";
              setRoundTrip(isRoundTrip);
              // Resetar destino de volta se mudar para só ida
              if (!isRoundTrip) {
                setReturnDestination("");
              }
            }}
          >
            <option value="oneway" className="text-blue-700">Só ida</option>
            <option value="roundtrip" className="text-blue-700">Ida e volta</option>
          </select>
        </div>

        {/* 3. DESTINO DE VOLTA (condicional) */}
        {roundTrip && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-blue-800">Destino de volta:</label>
            <select
              className="w-full border border-blue-200 rounded-lg p-2.5 bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800"
              value={returnDestination}
              onChange={(e) => setReturnDestination(e.target.value)}
            >
              <option value="" className="text-blue-500">Selecione um bairro (padrão: Central)</option>
              {neighborhoods.map((neighborhood) => (
                <option key={neighborhood} value={neighborhood} className="text-blue-700">
                  {neighborhood}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 4. TAMANHO DO ANIMAL */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-blue-800">Tamanho do animal:</label>
          <select
            className="w-full border border-blue-200 rounded-lg p-2.5 bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800"
            value={animalSize}
            onChange={(e) => setAnimalSize(e.target.value)}
          >
            <option value="small" className="text-blue-700">Pequeno (até 10kg)</option>
            <option value="medium" className="text-blue-700">Médio (10kg até 22kg)</option>
            <option value="large" className="text-blue-700">Grande (22kg até 40kg)</option>
            <option value="xlarge" className="text-blue-700">Gigante (acima de 40kg)</option>
          </select>
        </div>

        {/* 5. TIPO DE TRAJETO */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-blue-800">Tipo de trajeto:</label>
          <select
            className="w-full border border-blue-200 rounded-lg p-2.5 bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800"
            value={urban ? "urban" : "highway"}
            onChange={(e) => setUrban(e.target.value === "urban")}
          >
            <option value="urban" className="text-blue-700">Urbano</option>
            <option value="highway" className="text-blue-700">Rodovia</option>
          </select>
        </div>

        {/* 6. TEMPO DE ESPERA */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-blue-800">
            Tempo de espera (minutos):
          </label>
          <input
            type="number"
            className="w-full border border-blue-200 rounded-lg p-2.5 bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-blue-800"
            value={waitTime}
            onChange={(e) => setWaitTime(parseInt(e.target.value) || 0)}
          />
          <p className="text-xs text-blue-600">Tempo de espera superior a 60 min terá taxa adicional de R$ 20,00</p>
        </div>
      </div>

      {/* Botão de calcular com cor principal confiável */}
      <button
        onClick={calculatePrice}
        className="w-full bg-blue-600 text-white font-medium py-3.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
        disabled={!destination}
      >
        Calcular Preço
      </button>

      {/* Área de resultados com visual melhorado */}
      {total > 0 && (
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-5 rounded-lg shadow-md border-l-4 border-blue-600">
          <h2 className="text-xl font-bold text-center text-blue-700 mb-4">Detalhes do Transporte</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-blue-200 pb-2">
              <span className="font-medium text-blue-700">Tipo de viagem:</span>
              <span className="text-blue-800">{details.tipoViagem}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-blue-200 pb-2">
              <span className="font-medium text-blue-700">Distância (ida):</span>
              <span className="text-blue-800">{details.distanciaIda} km</span>
            </div>
            
            {/* Mostra preço de ida apenas se for viagem de ida */}
            {!roundTrip && (
              <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                <span className="font-medium text-blue-700">Preço da ida:</span>
                <span className="text-blue-800">R$ {details.ida}</span>
              </div>
            )}
            
            {/* Mostra distância de volta apenas se for ida e volta */}
            {roundTrip && (
              <>
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="font-medium text-blue-700">Distância (volta):</span>
                  <span className="text-blue-800">{details.distanciaVolta} km</span>
                </div>
                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                  <span className="font-medium text-blue-700">Destino de volta:</span>
                  <span className="text-blue-800">{details.destinoVolta || "Central"}</span>
                </div>
              </>
            )}
            
            {/* Informações adicionais com melhor formatação */}
            <div className="text-sm text-blue-700 mt-3 p-3 bg-blue-100 rounded-md">
              <p>
                {animalSize === "small" ? "Animal pequeno (até 10kg)" : 
                animalSize === "medium" ? "Animal médio (10kg até 22kg) - Taxa adicional: R$ 30,00" :
                animalSize === "large" ? "Animal grande (22kg até 40kg) - Taxa adicional: R$ 50,00" : 
                "Animal gigante (acima de 40kg) - Taxa adicional: R$ 80,00"}
              </p>
              {waitTime > 60 && (
                <p className="mt-1">Tempo de espera superior a 60 min - Taxa adicional: R$ 20,00</p>
              )}
            </div>
            
            {/* Total com destaque visual aprimorado */}
            <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-blue-200">
              <p className="text-2xl font-bold text-center text-blue-800">Total: R$ {total}</p>
            </div>
            
            {/* Botão de agendar com cor verde transmitindo segurança */}
            <button
              onClick={handleSchedule}
              className="w-full mt-4 bg-green-600 text-white font-medium py-3.5 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md flex items-center justify-center"
            >
              <span>Agendar Transporte</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default TransportCalculator;