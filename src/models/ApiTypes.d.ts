type CreateFields<T> = Omit<T, 'id' | 'updatedAt' | 'createdAt'>;
type DeckApi_WithoutCards = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	languageTag: string | null;
	name: string;
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
};

export { CreateFields, DeckApi, CardApi, DeckApi_WithoutCards, UserInfo };
