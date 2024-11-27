import { Panel } from "primereact/panel";
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import ReservaForm from "./ReservaForm";




function ReservaList() {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [reservaSelecionada, setReservaSelecionada] = useState(null);
    const [hospedeId, setHospedeId] = useState(""); 




    const listarReservas = async (idHospede) => {
        setLoading(true);
        try {
            const url = idHospede
                ? `http://localhost:8080/reservas/${idHospede}` 
                : 'http://localhost:8080/reservas'; 
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Falha na requisição');
            }
            const data = await response.json();
            setReservas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };





    useEffect(() => {
        listarReservas();
    }, []);



    const salvarReservas = async () => {
        await listarReservas();
        setIsAdding(false);
        setReservaSelecionada(null);
    };



    const handleEditarReserva = (Reserva) => {
        setReservaSelecionada(Reserva);
        setIsAdding(true);
    };



    const deletarReserva = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/reservas/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir Reserva');
            }

            listarReservas();
        } catch (err) {
            setError(err.message);
        }
    };



    const handleBuscarReservas = () => {
        if (hospedeId) {
            listarReservas(hospedeId);  
        } else {
            listarReservas();  
        }
    };




    return (
        <div>
            <Panel header={isAdding ? "Adicionar Reserva" : "Reservas Cadastradas"}>
                <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                    <Button
                        label={isAdding ? "Ver Lista de Reservas" : "Cadastrar Nova Reserva"}
                        icon={isAdding ? "pi pi-arrow-left" : "pi pi-plus"}
                        onClick={() => {
                            if (isAdding) {
                                setIsAdding(false);
                            } else {
                                setIsAdding(true);
                                setReservaSelecionada(null);
                            }
                        }}
                    />
                </div>

            
                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="number"
                        placeholder="Digite ID do Hospede"
                        value={hospedeId}
                        onChange={(e) => setHospedeId(e.target.value)}
                        style={{ marginRight: '0.5rem', padding: '1rem' }}
                    />
                    <Button label="Buscar Reservas por ID do Hospede" onClick={handleBuscarReservas} />
                </div>



                {loading && <ProgressSpinner />}
                {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

                {isAdding ? (
                    <ReservaForm
                        reserva={reservaSelecionada}
                        atualizarLista={salvarReservas}
                    />
                ) : (
                    <>
                        {!loading && reservas.length > 0 && (
                            <DataTable
                                value={reservas}
                                paginator
                                rows={5}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                tableStyle={{ minWidth: '50rem' }}
                                sortMode="multiple"
                            >
                                <Column
                                    field="hospede.id"
                                    header="Id do Hospede"
                                    style={{ width: '1%' }}
                                    sortable
                                />
                                <Column
                                    field="hospede.nome"
                                    header="Nome do Reservante"
                                    style={{ width: '15%' }}
                                    sortable
                                />
                                <Column
                                    field="dataChekin"
                                    header="Data De entrada"
                                    style={{ width: '15%' }}
                                    sortable
                                />
                                <Column
                                    field="dataCheckout"
                                    header="Data De saida"
                                    style={{ width: '15%' }}
                                    sortable
                                />
                                <Column
                                    field="valorTotal"
                                    header="Valor"
                                    style={{ width: '15%' }}
                                    sortable
                                    body={(rowData) => `R$ ${rowData.valorTotal}`}
                                />
                                <Column
                                    header="Ações"
                                    body={(rowData) => (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Button
                                                label="Editar"
                                                icon="pi pi-pencil"
                                                onClick={() => handleEditarReserva(rowData)}
                                                className="p-button-warning"
                                            />
                                            <Button
                                                label="Excluir"
                                                icon="pi pi-trash"
                                                onClick={() => deletarReserva(rowData.id)}
                                                className="p-button-danger"
                                            />
                                        </div>
                                    )}
                                    


                                />
                            </DataTable>


                        )}
                        {!loading && reservas.length === 0 && (
                            <p>Nenhuma Reserva cadastrada.</p>
                        )}
                    </>
                )}


            </Panel>
        </div>
    );
}

export default ReservaList;
