import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import DinamicTable from './components/DinamicTable';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import Swal from 'sweetalert2';

const statusSituations = [
  'Candidatura Recebida',
  'Triagem de Currículo',
  'Aguardando Entrevista',
  'Entrevista Agendada',
  'Em Processo de Avaliação',
  'Aprovado para Segunda Entrevista',
  'Teste Técnico',
  'Aprovado ',
  'Processo de Admissão',
  'Contratação Finalizada'
];

const validationSchema = Yup.object().shape({
  name: Yup.string().min(4).required("Nome é obrigatório"),
  email: Yup.string().email("Email inválido").required("Email é obrigatório"),
  situation: Yup.string().oneOf(statusSituations, 'Situação inválida').required("Situação é obrigatória"),
  date_admission: Yup.date().required("Data de admissão é obrigatória"),
});

function formatDate(data) {
  const date = new Date(data.replace(' ', 'T'));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const App = () => {
  const backUrl = import.meta.env.VITE_BACKEND_URL;
  const [showModal, setShowModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [editUserId, setEditUserId] = useState(true);
  const [filterText, setFilterText] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(backUrl);
      console.log(response.data)
      setTableData(response.data);

    } catch (error) {
      console.error('Erro na busca dos usuarios: ', error);
    }
  };
  useEffect(() => {

    return () => {
      fetchUsers();
    };
  }, []);

  const toggleModal = (data = null) => {
    setShowModal(!showModal);
    reset();

    if (data) {
      setEditUserId(data.id);
      setValue('id', data.id);
      setValue('name', data.name);
      setValue('email', data.email);
      setValue('situation', data.situation);
      setValue('date_admission', formatDate(data.date_admission));
    } else {
      setEditUserId(null);
    }
  };

  const filterUsers = tableData.filter(data => {
    const lowerCaseFilter = filterText.toLowerCase();
    return data.name.toLowerCase().includes(lowerCaseFilter) || data.email.toLowerCase().includes(lowerCaseFilter) || data.situation.toLowerCase().includes(lowerCaseFilter);
  });

  const handleFilter = (event) => {
    setFilterText(event.target.value);
  };

  const onSubmit = async (data) => {
    try {
      if (editUserId) {
        const result = await Swal.fire({
          title: 'Tem certeza?',
          text: "Você não poderá reverter isso!",
          icon: 'question',
          confirmButtonColor: '#57c940',
          confirmButtonText: 'Sim, salvar!',
          showCancelButton: true,
          cancelButtonColor: 'light',
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          const response = await axios.put(`${backUrl}/${editUserId}`, data);

          Swal.fire(
            'Alteração Salva!',
            'Dados do usuário foram alterados com sucesso.',
            'success'
          );

          if (response.status == 200) {
            fetchUsers();
          }
        }
      } else {
        const response = await axios.post(backUrl, data);
        if (response.status == 200) {
          fetchUsers();
        }
      }

      reset();
      toggleModal();
    } catch (error) {
      console.error('Erro no submit do formulario: ', error);
    }
  };

  const handleEdit = (id) => {
    const userEdit = tableData.find(dados => dados.id == id);
    toggleModal(userEdit);
  }

  const confirmEdit = (data) => {

  };

  return (
    <Container className="my-5 py-3 justify-content-md-center">
      <h1 className="mb-3 fw-bold">CADASTRO DE USUARIOS</h1>
      <Row className="mb-3 align-items-center">
        <Col className="text-start">
          <Form.Group controlId="formFilter" className="mb-0">
            <Form.Control type="text" placeholder="Digite o nome, email ou situação para filtrar" value={filterText} onChange={handleFilter} />
          </Form.Group>
        </Col>
        <Col className="text-end">
          <Button className="btn-umentor fw-bold" onClick={toggleModal}>
            adicionar usuário
          </Button>
        </Col>
      </Row>

      <DinamicTable tableData={filterUsers} fetchUsers={fetchUsers} handleEdit={handleEdit} />

      <Modal size='lg' centered show={showModal} onHide={toggleModal} >
        <Modal.Header closeButton>
          <Modal.Title>{editUserId ? "Editar Usuário" : "Adicionar Usuário"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formName">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" {...register("name")} isInvalid={!!errors.name} />
              <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" {...register("email")} isInvalid={!!errors.email} />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>

            <Row className='my-2'>
              <Col>
                <Form.Group controlId="formSituation">
                  <Form.Label>Situação</Form.Label>
                  <Form.Control as="select" {...register("situation")} isInvalid={!!errors.situation} >
                    <option value="">Selecione uma opção</option>
                    {statusSituations.map((element, index) => (
                      <option key={index} value={element}>{element}</option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.situation?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="formDataAdmission">
                  <Form.Label>Data de Admissão</Form.Label>
                  <Form.Control type="date" {...register("date_admission")} isInvalid={!!errors.date_admission} />
                  <Form.Control.Feedback type="invalid">{errors.date_admission?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Button type="submit" className="mt-3 px-5 btn-umentor fw-bold float-end">
              Salvar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default App;
