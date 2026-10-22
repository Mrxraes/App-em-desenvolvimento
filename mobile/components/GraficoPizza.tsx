import React from "react";
import Svg, { Circle, G, Path } from "react-native-svg";

type CategoriaGrafico = {
    nome: string;
    porcentagem: number;
    cor: string;
};

type GraficoPizzaProps = {
    dados: CategoriaGrafico[];
    tamanho?: number;
    espessura?: number;
};

export default function GraficoPizza({
    dados,
    tamanho = 120,
    espessura = 18,
}: GraficoPizzaProps) {
    const centro = tamanho / 2;
    const raio = (tamanho - espessura) / 2;
    const circunferencia = 2 * Math.PI * raio;

    const dadosValidos = dados.filter(
        item =>
            Number.isFinite(item.porcentagem) &&
            item.porcentagem > 0
    );

    const total = dadosValidos.reduce(
        (soma, item) => soma + item.porcentagem,
        0
    );

    let anguloAcumulado = 0;

    function coordenada(
        angulo: number,
        raioAtual: number
    ) {
        const radianos = (angulo * Math.PI) / 180;

        return {
            x: centro + raioAtual * Math.cos(radianos),
            y: centro + raioAtual * Math.sin(radianos),
        };
    }

    return (
        <Svg width={tamanho} height={tamanho}>
            <Circle
                cx={centro}
                cy={centro}
                r={raio}
                stroke="#E2E8F0"
                strokeWidth={espessura}
                fill="none"
            />

            <G>
                {dadosValidos.map((item, indice) => {
                    const proporcao = item.porcentagem / total;

                    const anguloInicial = anguloAcumulado - 90;
                    const anguloFinal =
                        anguloAcumulado + proporcao * 360 - 90;

                    anguloAcumulado += proporcao * 360;

                    // Evita problemas com arcos que completam 360 graus.
                    if (proporcao >= 0.999999) {
                        return (
                            <Circle
                                key={indice}
                                cx={centro}
                                cy={centro}
                                r={raio}
                                stroke={item.cor}
                                strokeWidth={espessura}
                                fill="none"
                            />
                        );
                    }

                    const inicio = coordenada(
                        anguloInicial,
                        raio
                    );

                    const fim = coordenada(
                        anguloFinal,
                        raio
                    );

                    const anguloTotal = proporcao * 360;
                    const arcoGrande = anguloTotal > 180 ? 1 : 0;

                    const caminho = [
                        `M ${inicio.x} ${inicio.y}`,
                        `A ${raio} ${raio} 0 ${arcoGrande} 1 ${fim.x} ${fim.y}`,
                    ].join(" ");

                    return (
                        <Path
                            key={indice}
                            d={caminho}
                            stroke={item.cor}
                            strokeWidth={espessura}
                            strokeLinecap="butt"
                            fill="none"
                        />
                    );
                })}
            </G>
        </Svg>
    );
}
