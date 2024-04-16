import NumberInput from "@/components/Inputs/NumberInput";
import SelectInput from "@/components/Inputs/SelectInput";
import { paTypes } from "@/utils/constants";
import { IContractRequest } from "@/utils/models";
import React from "react";
import { toast } from "react-hot-toast";

type PAInfoProps = {
  requestInfo: IContractRequest;
  setRequestInfo: React.Dispatch<React.SetStateAction<IContractRequest>>;
  goToPreviousStage: () => void;
  goToNextStage: () => void;
};
function PAInfo({
  requestInfo,
  setRequestInfo,
  goToPreviousStage,
  goToNextStage,
}: PAInfoProps) {
  function validateFields() {
    if (!requestInfo.aumentoDeCarga) {
      toast.error("Por favor, preencha se há aumento de carga.");
      return false;
    }
    if (requestInfo.aumentoDeCarga == "SIM") {
      if (!requestInfo.caixaConjugada) {
        toast.error("Por favor, preencha se há caixa conjugada.");
        return false;
      }
      if (!requestInfo.tipoDePadrao) {
        toast.error("Por favor, preencha o tipo de padrão.");
        return false;
      }
      if (
        requestInfo.respTrocaPadrao == "NÃO SE APLICA" &&
        requestInfo.aumentoDeCarga == "SIM"
      ) {
        toast.error("Por favor, preencha o responsável pela troca do padrão.");
        return false;
      }
      if (
        (requestInfo.formaPagamentoPadrao == "NÃO SE APLICA" ||
          !requestInfo.formaPagamentoPadrao) &&
        requestInfo.aumentoDeCarga == "SIM"
      ) {
        toast.error("Por favor, preencha a forma de pagamento do padrão.");
        return false;
      }
      if (requestInfo.valorPadrao == null) {
        toast.error("Por favor, preencha o valor do padrão.");
        return false;
      }
      return true;
    }
    return true;
  }
  return (
    <div className="flex w-full grow flex-col bg-[#fff] pb-2">
      <span className="py-2 text-center text-lg font-bold uppercase text-[#15599a]">
        AUMENTO DE CARGA
      </span>
      <div className="flex w-full grow flex-col">
        <div className="mt-2 flex justify-center p-2">
          <SelectInput
            label={"HAVERÁ TROCA DE PADRÃO/AUMENTO DE CARGA?"}
            editable={true}
            options={[
              {
                id: 1,
                label: "NÃO",
                value: "NÃO",
              },
              {
                id: 2,
                label: "SIM",
                value: "SIM",
              },
            ]}
            value={requestInfo.aumentoDeCarga}
            handleChange={(value) =>
              setRequestInfo({ ...requestInfo, aumentoDeCarga: value })
            }
            selectedItemLabel="NÃO DEFINIDO"
            onReset={() =>
              setRequestInfo((prev) => ({ ...prev, aumentoDeCarga: null }))
            }
          />
        </div>
        {requestInfo.aumentoDeCarga == "SIM" ? (
          <div className="col-span-3 flex items-center justify-center">
            <SelectInput
              label={"RESPONSÁVEL PELA TROCA"}
              editable={true}
              value={requestInfo.respTrocaPadrao}
              handleChange={(value) =>
                setRequestInfo({ ...requestInfo, respTrocaPadrao: value })
              }
              options={[
                {
                  id: 1,
                  label: "AMPERE",
                  value: "AMPERE",
                },
                {
                  id: 2,
                  label: "CLIENTE",
                  value: "CLIENTE",
                },
                {
                  id: 3,
                  label: "NÃO SE APLICA",
                  value: "NÃO SE APLICA",
                },
              ]}
              selectedItemLabel="NÃO DEFINIDO"
              onReset={() => {
                setRequestInfo((prev) => ({
                  ...prev,
                  respTrocaPadrao: null,
                }));
              }}
            />
          </div>
        ) : null}

        {requestInfo.aumentoDeCarga == "SIM" && (
          <div className="flex flex-col gap-2 p-2 lg:grid lg:grid-cols-3">
            <div className="flex items-center justify-center">
              <SelectInput
                width={"450px"}
                label={"TIPO DO PADRÃO"}
                editable={true}
                value={requestInfo.tipoDePadrao}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, tipoDePadrao: value })
                }
                options={paTypes.map((type, index) => {
                  return {
                    id: index + 1,
                    label: type.label,
                    value: type.value,
                  };
                })}
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => {
                  setRequestInfo((prev) => ({
                    ...prev,
                    tipoDePadrao: null,
                  }));
                }}
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectInput
                width={"450px"}
                label={"HAVERÁ AUMENTO DO DISJUNTOR?"}
                editable={true}
                value={requestInfo.aumentoDisjuntor}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, aumentoDisjuntor: value })
                }
                options={[
                  {
                    id: 1,
                    label: "SIM",
                    value: "SIM",
                  },
                  {
                    id: 2,
                    label: "NÃO",
                    value: "NÃO",
                  },
                ]}
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => {
                  setRequestInfo((prev) => ({
                    ...prev,
                    aumentoDisjuntor: null,
                  }));
                }}
              />
            </div>
            <div className="flex items-center justify-center">
              <SelectInput
                width={"450px"}
                label={"CAIXA CONJUGADA?"}
                editable={true}
                options={[
                  {
                    id: 1,
                    label: "NÃO",
                    value: "NÃO",
                  },
                  {
                    id: 2,
                    label: "SIM",
                    value: "SIM",
                  },
                ]}
                value={requestInfo.caixaConjugada}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, caixaConjugada: value })
                }
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() => {
                  setRequestInfo((prev) => ({ ...prev, caixaConjugada: null }));
                }}
              />
            </div>
            <h1 className="col-span-3 py-2 text-center font-bold text-[#fead61]">
              PAGAMENTO
            </h1>
            <div className="col-span-3 flex flex-wrap items-center justify-center gap-2">
              <SelectInput
                width={"450px"}
                label={"PAGAMENTO DO PADRÃO"}
                editable={true}
                value={requestInfo.formaPagamentoPadrao}
                options={[
                  {
                    id: 1,
                    label: "CLIENTE IRÁ COMPRAR EM SEPARADO",
                    value: "CLIENTE IRÁ COMPRAR EM SEPARADO",
                  },
                  {
                    id: 2,
                    label: "CLIENTE PAGAR POR FORA",
                    value: "CLIENTE PAGAR POR FORA",
                  },
                  {
                    id: 3,
                    label: "INCLUSO NO CONTRATO",
                    value: "INCLUSO NO CONTRATO",
                  },
                  {
                    id: 4,
                    label: "NÃO HAVERA TROCA PADRÃO",
                    value: "NÃO HAVERA TROCA PADRÃO",
                  },
                ]}
                handleChange={(value) => {
                  setRequestInfo({
                    ...requestInfo,
                    formaPagamentoPadrao: value,
                  });
                }}
                selectedItemLabel="NÃO DEFINIDO"
                onReset={() =>
                  setRequestInfo((prev) => ({
                    ...prev,
                    formaPagamentoPadrao: null,
                  }))
                }
              />
              <NumberInput
                width={"450px"}
                label={"VALOR DO PADRÃO"}
                editable={true}
                value={requestInfo.valorPadrao ? requestInfo.valorPadrao : null}
                handleChange={(value) =>
                  setRequestInfo({ ...requestInfo, valorPadrao: Number(value) })
                }
                placeholder="Preencha aqui o valor do padrão."
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 flex w-full flex-wrap justify-between  gap-2">
        <button
          onClick={() => {
            goToPreviousStage();
          }}
          className="rounded p-2 font-bold text-gray-500 duration-300 hover:scale-105"
        >
          Voltar
        </button>
        <button
          onClick={() => {
            if (validateFields()) goToNextStage();
          }}
          className="rounded p-2 font-bold hover:bg-black hover:text-white"
        >
          Prosseguir
        </button>
      </div>
    </div>
  );
}

export default PAInfo;
