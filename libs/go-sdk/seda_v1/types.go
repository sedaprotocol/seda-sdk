package seda_v1

import "encoding/json"

type ByteArray []byte

func (b ByteArray) MarshalJSON() ([]byte, error) {
	if b == nil {
		return []byte("null"), nil
	}
	bytes := make([]int, len(b))
	for i, v := range b {
		bytes[i] = int(v)
	}
	return json.Marshal(bytes)
}
