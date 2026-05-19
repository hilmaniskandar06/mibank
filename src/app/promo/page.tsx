import React from 'react';
import { getPromos } from '../actions';
import PromoList from './PromoList';
import TemplatePage from '@/components/TemplatePage';

export default async function PromoPage() {
  const promos = await getPromos();

  return (
    <TemplatePage 
      titleId="Promo Terbaru Mitra Perbankan Indonesia" 
      titleEn="Mitra Perbankan Indonesia Latest Promotions" 
      contentId={
        <div>
          <p>Cek berbagai promo menarik dari kartu kredit dan debit Mitra Perbankan Indonesia untuk keuntungan belanja Anda.</p>
          <PromoList promos={promos} />
        </div>
      }
      contentEn={
        <div>
          <p>Check out various attractive promotions from Mitra Perbankan Indonesia credit and debit cards for your shopping benefits.</p>
          <PromoList promos={promos} />
        </div>
      }
    />
  );
}
