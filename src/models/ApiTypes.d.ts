type CreateFields<T> = Omit<T, 'id' | 'updatedAt' | 'createdAt'>;
type ObjectPermission = 'DELETE' | 'EDIT';
type DeckApi_WithoutCards = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	languageTag: string | null;
	name: string;
	permissions: ObjectPermission[];
	numberOfCards: number;
	ownerName: string;
	movie: { id: number; title: string };
};
type DeckApi = DeckApi_WithoutCards & { cards: CardApi[] };

type CardApi = {
	from: string;
	text: string;
	to: string;
	position: {
		x: number;
		y: number;
	};
	id: number;
};
type UserInfo = {
	username: string;
	nbOfDecks: number;
	permissions: 'READ_DECKS' | 'CREATE_DECKS';
};

export { CreateFields, DeckApi, CardApi, DeckApi_WithoutCards, UserInfo };
