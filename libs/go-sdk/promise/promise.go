package promise

type PromiseStatus struct {
	Fulfilled *[]byte
	Rejected  *[]byte
}

func (p *PromiseStatus) GetFulfilled() []byte {
	if p.Fulfilled == nil {
		panic("Promise is not fulfilled")
	}

	return *p.Fulfilled
}

func (p *PromiseStatus) GetRejected() []byte {
	if p.Rejected == nil {
		panic("Promise is not rejected")
	}

	return *p.Rejected
}

func (p *PromiseStatus) IsFulfilled() bool {
	return p.Fulfilled != nil
}

func (p *PromiseStatus) IsRejected() bool {
	return p.Rejected != nil
}
