import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";



function ReservaForm({ reserva, atualizarLista }) {

    
    const [hospede, setHospede] = useState(null);
    const [hospedes, setHospedes] = useState([]);
    const [dataChekin, setDataChekin] = useState('');
    const [dataCheckout, setDataCheckout] = useState('');
    const [valorTotal, setValorTotal] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});





    useEffect(() => {
        
        fetch('http://localhost:8080/hospedes')
            .then((res) => res.json())
            .then((data) => setHospedes(data))
            .catch((error) => console.error('Erro ao buscar hóspedes:', error));

        
        if (reserva) {
            setHospede(reserva.hospede || null);
            setDataChekin(reserva.dataChekin || '');
            setDataCheckout(reserva.dataCheckout || '');
            setValorTotal(reserva.valorTotal || '');
        }
    }, [reserva]);




    const salvarReserva = async (e) => {
        e.preventDefault();

        const dadosReserva = {
            hospede: hospede, 
            dataChekin: dataChekin, 
            dataCheckout: dataCheckout,
            valorTotal: parseFloat(valorTotal), 
        };

        const url = reserva
            ? `http://localhost:8080/reservas/${reserva.id}`
            : 'http://localhost:8080/reservas';

        const method = reserva ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosReserva),
            });

            if (response.ok) {
                setMensagem(reserva ? 'Reserva editada com sucesso!' : 'Reserva cadastrada com sucesso!');
                setHospede(null);
                setDataChekin('');
                setDataCheckout('');
                setValorTotal('');
                atualizarLista();
            } else {
                const problema = await response.json();
                if (problema.titulo) {
                    setMensagem(problema.titulo);
                }
                if (Array.isArray(problema)) {
                    const errors = {};
                    problema.forEach((campo) => {
                        errors[campo.nome] = campo.mensagem;
                    });
                    setFieldErrors(errors);
                }
            }
        } catch (error) {
            setMensagem(`Erro: ${error.message}`);
        }
    };






    return (
        <>
            <form onSubmit={salvarReserva} className="p-fluid" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="p-field" style={{ marginBottom: '20px' }}>
                    <label htmlFor="hospede" style={{ fontWeight: 'bold' }}>
                        Nome do Hóspede
                    </label>
                    <Dropdown
                        id="hospede"
                        value={hospede}
                        options={hospedes}
                        onChange={(e) => setHospede(e.value)}
                        optionLabel="nome"
                        placeholder="Selecione um hóspede"
                        className="p-dropdown"
                        required
                    />
                    {fieldErrors.hospede && <Message severity="error" text={fieldErrors.hospede} />}
                </div>



                <div className="p-field" style={{ marginBottom: '20px' }}>
                    <label htmlFor="dataChekin" style={{ fontWeight: 'bold' }}>
                        Data de Entrada
                    </label>
                    <Calendar
                        id="dataChekin"
                        value={dataChekin}
                        onChange={(e) => setDataChekin(e.value)}
                        dateFormat="yy-mm-dd"
                        placeholder="Selecione a data de entrada"
                    />
                    {fieldErrors.dataChekin && <Message severity="error" text={fieldErrors.dataChekin} />}
                </div>



                <div className="p-field" style={{ marginBottom: '20px' }}>
                    <label htmlFor="dataCheckout" style={{ fontWeight: 'bold' }}>
                        Data de Saída
                    </label>
                    <Calendar
                        id="dataCheckout"
                        value={dataCheckout}
                        onChange={(e) => setDataCheckout(e.value)}
                        dateFormat="yy-mm-dd"
                        placeholder="Selecione a data de saída"
                    />
                    {fieldErrors.dataCheckout && <Message severity="error" text={fieldErrors.dataCheckout} />}
                </div>



                <div className="p-field" style={{ marginBottom: '20px' }}>
                    <label htmlFor="valorTotal" style={{ fontWeight: 'bold' }}>
                        Valor Total
                    </label>
                    <InputText
                        id="valorTotal"
                        value={valorTotal}
                        onChange={(e) => setValorTotal(e.target.value)}
                        placeholder="Digite o valor da reserva"
                        required
                        className="p.inputtext-lg"
                    />

                    {fieldErrors.valorTotal && <Message severity="error" text={fieldErrors.valorTotal} />}
                </div>



                <Divider />
                <Button
                    label={reserva ? "Atualizar Reserva" : "Cadastrar Reserva"}
                    icon="pi pi-check"
                    type="submit"
                    className="p-button-rounded p-button-lg"
                />

                {mensagem && <Message severity="success" text={mensagem} style={{ marginTop: '20px' }} />}
                {fieldErrors.global && <Message severity="error" text={fieldErrors.global} style={{ marginTop: '20px' }} />}
            </form>
        </>
    );
}



export default ReservaForm;
