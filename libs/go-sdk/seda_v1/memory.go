package seda_v1

import "unsafe"

func GetDataPtr(data []byte) (uintptr, uint32) {
	dataLen := uint32(len(data))

	var dataPtr unsafe.Pointer
	if dataLen == 0 {
		dataPtr = unsafe.Pointer(nil)
	} else {
		dataPtr = unsafe.Pointer(&data[0])
	}

	return uintptr(dataPtr), dataLen
}

func GetResultData[T uint8 | uint32 | uint64](resultLength T) []byte {
	if resultLength == 0 {
		return []byte{}
	}

	resultDataPtr := make([]byte, resultLength)
	CallResultWrite(uintptr(unsafe.Pointer(&resultDataPtr[0])), uint32(resultLength))

	return resultDataPtr
}
