package process

import (
	"os"
	"strconv"
	"strings"
)

const (
	VM_MODE_ENV_KEY               = "VM_MODE"
	VM_MODE_TALLY                 = "tally"
	VM_MODE_DR                    = "dr"
	DR_REPLICATION_FACTOR_ENV_KEY = "DR_REPLICATION_FACTOR"
)

func Envs() map[string]string {
	rawEnvs := os.Environ()
	envs := make(map[string]string)
	for _, rawEnv := range rawEnvs {
		parts := strings.SplitN(rawEnv, "=", 2)
		envs[parts[0]] = parts[1]
	}
	return envs
}

func GetVmMode() string {
	mode, ok := os.LookupEnv(VM_MODE_ENV_KEY)
	if !ok {
		Error([]byte("VM_MODE is not set in environment"))
	}
	return mode
}

func IsTallyVmMode() bool {
	return GetVmMode() == VM_MODE_TALLY
}

func IsDrVmMode() bool {
	return GetVmMode() == VM_MODE_DR
}

func ReplicationFactor() uint16 {
	factor, ok := os.LookupEnv(DR_REPLICATION_FACTOR_ENV_KEY)
	if !ok {
		Error([]byte("DR_REPLICATION_FACTOR is not set in environment"))
	}
	parsedFactor, err := strconv.ParseUint(factor, 10, 16)
	if err != nil {
		Error([]byte("DR_REPLICATION_FACTOR must be a valid u16"))
	}
	return uint16(parsedFactor)
}
