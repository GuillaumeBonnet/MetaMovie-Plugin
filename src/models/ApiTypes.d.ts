type CreateFields<T> = Omit<T, 'id' | 'updatedAt' | 'createdAt'>;
type ObjectPermission = 'DELETE' | 'EDIT';
type DeckApi_WithoutCards = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	languageTag: string | null;
	name: string;
	permissions: ObjectPermission[];
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
	permissions: 'READ_DECKS' | 'CREATE_DECKS';
};

export { CreateFields, DeckApi, CardApi, DeckApi_WithoutCards, UserInfo };
