// src/components/Home.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function Home() {
  const [roomInput, setRoomInput] = useState('');
  const navigate = useNavigate();

  const createRoom = async () => {
    const roomId = generateRoomId();
    await setDoc(doc(db, 'rooms', roomId), {
      currentCard: getRandomCard(),
      declaration: '',
      betPoint: 0,
    });
    navigate(`/host/${roomId}`);
  };

  const joinRoom = () => {
    if (roomInput.trim() !== '') navigate(`/guest/${roomInput.trim().toUpperCase()}`);
  };

  const getRandomCard = () => {
    const cards = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    return cards[Math.floor(Math.random() * cards.length)] + '_of_spades';
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">High & Low ゲーム</h1>

      <button onClick={createRoom} className="mb-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
        部屋を建てる人
      </button>

      <input
        type="text"
        placeholder="部屋IDを入力"
        className="mb-2 px-2 py-1 text-black rounded"
        value={roomInput}
        onChange={(e) => setRoomInput(e.target.value)}
      />
      <button onClick={joinRoom} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
        部屋に入る人
      </button>
    </div>
  );
}
