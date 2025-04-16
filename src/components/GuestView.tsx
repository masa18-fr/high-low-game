// src/components/GuestView.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const getCardImage = (card: string) => `https://deckofcardsapi.com/static/img/${card[0].toUpperCase()}H.png`;

export default function GuestView() {
  const { roomId } = useParams();
  const [currentCard, setCurrentCard] = useState('');
  const [previousCard, setPreviousCard] = useState('');
  const [declaration, setDeclaration] = useState('');
  const [betPoint, setBetPoint] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (!roomId) return;
    const roomRef = doc(db, 'rooms', roomId);
    const unsub = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPreviousCard(data.history?.[data.history.length - 2] || '');
        setCurrentCard(data.currentCard);
        setDeclaration(data.declaration);
        setBetPoint(data.betPoint);
        setHistory((data.history || []).map((c: string) => c.replace(/[^0-9JQKA]/g, '')));
      }
    });
    return () => unsub();
  }, [roomId]);

  const getResultText = () => {
    if (!previousCard || !currentCard) return '判定待ち';
    const cardOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const prevIndex = cardOrder.indexOf(previousCard);
    const currIndex = cardOrder.indexOf(currentCard);
    if (currIndex > prevIndex) return 'HIGH';
    if (currIndex < prevIndex) return 'LOW';
    return 'EQUAL';
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl mb-4">ゲストビュー - 部屋ID: {roomId}</h2>
      <div className="mb-2">宣言: {declaration}</div>
      <div className="mb-2">ベットポイント: {betPoint}</div>

      {previousCard && (
        <div className="mb-2">
          <p className="text-sm">前のカード</p>
          <img src={getCardImage(previousCard)} alt={previousCard} className="w-24 mx-auto" />
        </div>
      )}

      {currentCard && (
        <div className="mb-4">
          <p className="text-sm">現在のカード</p>
          <img src={getCardImage(currentCard)} alt={currentCard} className="w-32 mx-auto" />
        </div>
      )}

      <div className="mb-4">結果判定: {getResultText()}</div>

      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg underline mb-2">カード履歴</h3>
          <div className="flex flex-wrap gap-2">
            {history.map((card, i) => (
              <span key={i} className="bg-gray-700 px-2 py-1 rounded text-sm">{card}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
