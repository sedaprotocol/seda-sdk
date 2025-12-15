import { Maybe } from "true-myth";

type Node<K, V> = {
	key: K;
	value: V;
	prev: Maybe<Node<K, V>>;
	next: Maybe<Node<K, V>>;
};

export class CapacityMap<K, V> {
	private capacity: number;
	private map: Map<K, Node<K, V>> = new Map();
	private head: Maybe<Node<K, V>> = Maybe.nothing();
	private tail: Maybe<Node<K, V>> = Maybe.nothing();

	constructor(capacity: number) {
		this.capacity = capacity;
	}

	size() {
		return this.map.size;
	}

	values() {
		return this.map.values();
	}

	keys() {
		return this.map.keys();
	}

	set(key: K, value: V) {
		const existingNode = Maybe.of(this.map.get(key));

		if (existingNode.isJust) {
			// Update existing node and move to head
			existingNode.value.value = value;
			this.moveToHead(existingNode.value);
			return;
		}

		// Create new node
		const newNode: Node<K, V> = {
			key,
			value,
			prev: Maybe.nothing(),
			next: Maybe.nothing(),
		};

		if (this.map.size >= this.capacity) {
			// Remove least recently used (tail)
			if (this.tail.isJust) {
				this.map.delete(this.tail.value.key);
				this.removeNode(this.tail.value);
			}
		}

		// Add new node to head
		this.addToHead(newNode);
		this.map.set(key, newNode);
	}

	get(key: K): Maybe<V> {
		const node = Maybe.of(this.map.get(key));

		if (node.isNothing) {
			return Maybe.nothing();
		}

		// Move to head (mark as recently used)
		this.moveToHead(node.value);

		return Maybe.of(node.value.value);
	}

	delete(key: K): boolean {
		const node = Maybe.of(this.map.get(key));

		if (node.isNothing) {
			return false;
		}

		// Remove from map and linked list
		this.map.delete(key);
		this.removeNode(node.value);

		return true;
	}

	private addToHead(node: Node<K, V>) {
		node.prev = Maybe.nothing();
		node.next = this.head;

		if (this.head.isJust) {
			this.head.value.prev = Maybe.just(node);
		}

		this.head = Maybe.just(node);

		if (this.tail.isNothing) {
			this.tail = Maybe.just(node);
		}
	}

	private removeNode(node: Node<K, V>) {
		if (node.prev.isJust) {
			node.prev.value.next = node.next;
		} else {
			this.head = node.next;
		}

		if (node.next.isJust) {
			node.next.value.prev = node.prev;
		} else {
			this.tail = node.prev;
		}
	}

	private moveToHead(node: Node<K, V>) {
		this.removeNode(node);
		this.addToHead(node);
	}
}
