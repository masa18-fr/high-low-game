// src/components/HostView.tsx
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const getRandomCard = () => cards[Math.floor(Math.random() * cards.length)];
const getCardImage = (card: string) => `https://deckofcardsapi.com/static/img/${card[0].toUpperCase()}H.png`;

const compareCards = (oldCard: string, newCard: string) => {
  const oldIndex = cards.indexOf(oldCard);
  const newIndex = cards.indexOf(newCard);
  return newIndex > oldIndex ? 'HIGH' : newIndex < oldIndex ? 'LOW' : 'EQUAL';
};

export default function HostView() {
  const { roomId } = useParams();
  const [currentCard, setCurrentCard] = useState('');
  const [previousCard, setPreviousCard] = useState('');
  const [declaration, setDeclaration] = useState('');
  const [betPoint, setBetPoint] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [inputPoint, setInputPoint] = useState(0);

  useEffect(() => {
    if (!roomId) return;
    const ref = doc(db, 'rooms', roomId);
    const unsub = onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentCard(data.currentCard);
        setDeclaration(data.declaration);
        setBetPoint(data.betPoint);
        setHistory(data.history || []);
      }
    });
    return () => unsub();
  }, [roomId]);

  const handleDraw = async () => {
    if (!roomId || !declaration) return;
    const newCard = getRandomCard();
    const roomRef = doc(db, 'rooms', roomId);
    const docSnap = await getDoc(roomRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const prevCard = data.currentCard;
      const result = compareCards(prevCard, newCard);
      const success = result !== 'EQUAL' && result === data.declaration;
      const newPoint = success ? data.betPoint * 2 : 0;
      const updatedHistory = [...(data.history || []), newCard];

      setPreviousCard(prevCard);
      setCurrentCard(newCard);
      setBetPoint(newPoint);
      setHistory(updatedHistory);

      await updateDoc(roomRef, {
        currentCard: newCard,
        betPoint: newPoint,
        history: updatedHistory
      });
    }
  };

  const handleDeclarationChange = async (value: string) => {
    setDeclaration(value);
    if (!roomId) return;
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
      declaration: value
    });
  };

  const handlePointSet = async () => {
    setBetPoint(inputPoint);
    if (!roomId) return;
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
      betPoint: inputPoint
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-4">
      <h2 className="text-2xl mb-4">ホストビュー - 部屋ID: {roomId}</h2>
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
      <div className="mb-4">
        <label className="block mb-1">宣言（High / Low）:</label>
        <select
          value={declaration}
          onChange={(e) => handleDeclarationChange(e.target.value)}
          className="text-black px-2 py-1 rounded"
        >
          <option value="">選択</option>
          <option value="HIGH">HIGH</option>
          <option value="LOW">LOW</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1">賭けポイント:</label>
        <input
          type="number"
          value={inputPoint}
          onChange={(e) => setInputPoint(Number(e.target.value))}
          className="text-black px-2 py-1 rounded"
        />
        <button
          onClick={handlePointSet}
          className="ml-2 px-3 py-1 bg-blue-600 rounded"
        >
          セット
        </button>
      </div>
      <div className="mb-4">現在のポイント: {betPoint}</div>
      <button
        onClick={handleDraw}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
      >
        カードを引く
      </button>

      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg underline mb-2">カード履歴</h3>
          <div className="flex flex-wrap gap-2">
            {history.map((card, i) => (
              <span key={i} className="bg-slate-700 px-2 py-1 rounded text-sm">{card}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
