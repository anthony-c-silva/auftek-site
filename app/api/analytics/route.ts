import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function GET() {
    const propertyId = process.env.GA_PROPERTY_ID;

    if (!propertyId) {
        return NextResponse.json({ error: 'GA_PROPERTY_ID não configurado' }, { status: 500 });
    }

    const credentialsJsonPath = process.cwd() + '/service-account.json';

    try {
        const client = new BetaAnalyticsDataClient({
            keyFilename: credentialsJsonPath,
        });

        // Executa dois relatórios em paralelo
        const [trendReport, pagesReport] = await Promise.all([
            // 1. Relatório de Tendência (Gráfico)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                dimensions: [{ name: 'date' }],
                metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
                orderBys: [{ dimension: { orderType: 'ALPHANUMERIC', dimensionName: 'date' } }]
            }),

            // 2. Relatório de Páginas (Tabela)
            client.runReport({
                property: `properties/${propertyId}`,
                dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
                metrics: [{ name: 'screenPageViews' }],
                limit: 20, // Top 20 páginas
            })
        ]);

        // Formata os dados do Gráfico
        const chartData = trendReport[0].rows?.map((row) => ({
            date: row.dimensionValues?.[0].value,
            users: Number(row.metricValues?.[0].value),
            views: Number(row.metricValues?.[1].value),
        })) || [];

        // Formata os dados das Páginas
        const pagesData = pagesReport[0].rows?.map((row) => ({
            path: row.dimensionValues?.[0].value,
            title: row.dimensionValues?.[1].value,
            views: Number(row.metricValues?.[0].value),
        })) || [];

        return NextResponse.json({
            chart: chartData,
            pages: pagesData
        });

    } catch (error: any) {
        console.error('Erro API Analytics:', error.message);
        return NextResponse.json({ error: 'Falha ao buscar dados' }, { status: 500 });
    }
}