import { Panel } from "primereact/panel";
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import HospedeForm from "./HospedeForm";

function HospedeList() {

    
    const [hospedes, setHospedes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [hospedeSelecionado, setHospedeSelecionado] = useState(null);

    

    const listarHospedes = async () => {
        try {
            const response = await fetch('http://localhost:8080/hospedes');
            if (!response.ok) {
                throw new Error('Falha na requisição');
            }
            const data = await response.json();
            setHospedes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        listarHospedes();
    }, []);

    const salvarHospedes = async () => {
        await listarHospedes();
        setIsAdding(false);
        setHospedeSelecionado(null);
    };

    const handleEditarHospede = (hospede) => {
        setHospedeSelecionado(hospede);
        setIsAdding(true);
    };




    
    const deletarHospede = async (id) => {

        try {
            const response = await fetch(`http://localhost:8080/hospedes/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir hóspede');
            }

           
            listarHospedes();
        } catch (err) {
            setError(err.message);
        }
    };

    




    return (
        <div>
            <Panel header={isAdding ? "Adicionar Hospede" : "Hóspedes Cadastrados"}>
                <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                    <Button
                        label={isAdding ? "Ver Lista de Hóspedes" : "Cadastrar Novo Hóspede"}
                        icon={isAdding ? "pi pi-arrow-left" : "pi pi-plus"}
                        onClick={() => {
                            if (isAdding) {
                                setIsAdding(false);
                            } else {
                                setIsAdding(true);
                                setHospedeSelecionado(null);
                            }
                        }}
                    />
                </div>

                {loading && <ProgressSpinner />}
                {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

                {isAdding ? (
                    <HospedeForm
                        hospede={hospedeSelecionado}
                        atualizarLista={salvarHospedes}
                    />
                ) : (
                    <>
                        {!loading && hospedes.length > 0 && (
                            <DataTable
                                value={hospedes}
                                paginator
                                rows={5}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                tableStyle={{ minWidth: '50rem' }}
                                sortMode="multiple"
                            >
                                <Column
                                    field="nome"
                                    header="Nome"
                                    style={{ width: '25%' }}
                                    sortable
                                />
                                <Column
                                    field="cpf"
                                    header="CPF"
                                    style={{ width: '25%' }}
                                    sortable
                                />
                                <Column
                                    field="telefone"
                                    header="Telefone"
                                    style={{ width: '25%' }}
                                    sortable
                                />
                                <Column
                                    field="dataNascimento"
                                    header="Data de Nascimento"
                                    style={{ width: '25%' }}
                                    sortable
                                />






                                <Column
                                    header="Ações"
                                    body={(rowData) => (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Button
                                                label="Editar"
                                                icon="pi pi-pencil"
                                                onClick={() => handleEditarHospede(rowData)}
                                                className="p-button-warning"
                                            />
                                            <Button
                                                label="Excluir"
                                                icon="pi pi-trash"
                                                onClick={() => deletarHospede(rowData.id)}
                                                className="p-button-danger"
                                            />
                                        </div>
                                    )}
                                    style={{ width: '30%' }}
                                />
                            </DataTable>
                        )}
                        {!loading && hospedes.length === 0 && (
                            <p>Nenhum hóspede cadastrado.</p>
                        )}
                    </>
                )}
            </Panel>
        </div>
    );
}

export default HospedeList;
