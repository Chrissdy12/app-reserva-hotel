import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { InputMask } from "primereact/inputmask";
import { Calendar } from "primereact/calendar";

function HospedeForm({ hospede, atualizarLista }) {


    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [fieldErrors, setFieldErrors] = useState('');



    useEffect(() => {
        if (hospede) {
            setNome(hospede.nome || '');
            setCpf(hospede.cpf || '');
            setTelefone(hospede.telefone || '');
            setDataNascimento(hospede.dataNascimento || '');
        }
    }, [hospede]);




    const salvarHospede = async (e) => {
        e.preventDefault();

        const dadosHospede = { nome, cpf, telefone, dataNascimento };
        const url = hospede
            ? `http://localhost:8080/hospedes/${hospede.id}`
            : 'http://localhost:8080/hospedes';

        const method = hospede ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosHospede),
            });

            if (response.ok) {
                setMensagem(hospede ? 'Hóspede atualizado com sucesso!' : 'Hóspede cadastrado com sucesso!');
                setNome('');
                setCpf('');
                setTelefone('');
                setDataNascimento('');
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
            <form onSubmit={salvarHospede} className="p-fluid" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="p.field" style={{ marginBottom: '20px' }}>
                    <label htmlFor="nome" style={{ fontWeight: 'bold' }}>
                        Nome
                    </label>
                    <InputText
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Digite o nome do Hóspede"
                        required
                        className="p.inputtext-lg"
                    />
                    {fieldErrors.nome && <Message severity="error" text={fieldErrors.nome} />}
                </div>



                <div className="p.field" style={{ marginBottom: '20px' }}>
                    <label htmlFor="cpf" style={{ fontWeight: 'bold' }}>
                        CPF
                    </label>
                    <InputMask
                        id="cpf"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="Digite o CPF do Hóspede"
                        required
                        className="p.inputtext-lg"
                        mask="999.999.999-99"
                    />
                    {fieldErrors.cpf && <Message severity="error" text={fieldErrors.cpf} />}
                </div>



                <div className="p.field" style={{ marginBottom: '20px' }}>
                    <label htmlFor="telefone" style={{ fontWeight: 'bold' }}>
                        Telefone
                    </label>
                    <InputMask
                        id="telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="Digite o telefone do Hóspede"
                        required
                        className="p.inputtext-lg"
                        mask="(99) 99999-9999"
                    />
                    {fieldErrors.telefone && <Message severity="error" text={fieldErrors.telefone} />}
                </div>



                <div className="p.field" style={{ marginBottom: '20px' }}>
                    <label htmlFor="dataNascimento" style={{ fontWeight: 'bold' }}>
                        Data de Nascimento
                    </label>
                    <Calendar
                        id="dataNascimento"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.value)}
                        dateFormat="yy-mm-dd"
                        placeholder="Selecione a data de nascimento"
                    />
                    {fieldErrors.dataNascimento && <Message severity="error" text={fieldErrors.dataNascimento} />}
                </div>

                

                <Divider />
                <Button
                    label={hospede ? "Atualizar Hóspede" : "Cadastrar Hóspede"}
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

export default HospedeForm;
