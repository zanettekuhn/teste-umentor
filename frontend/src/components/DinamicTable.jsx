import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { BsFillPencilFill, BsFillTrashFill } from "react-icons/bs";
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import axios from 'axios';

const DinamicTable = ({ tableData, handleEdit, fetchUsers }) => {
  const backUrl = import.meta.env.VITE_BACKEND_URL;

  const handleDelete = async (id) => {
    try {
      const resp = await axios.delete(`${backUrl}/?id=${id}`);
      if (resp.status == 200) {
        fetchUsers();
        console.log('excluiu ja era');
      }
    } catch (error) {
      console.error('Erro ao excluir o usuário:', error);
    }
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      confirmButtonColor: '#ff0800',
      confirmButtonText: 'Sim, excluir!',
      showCancelButton: true,
      cancelButtonColor: 'light',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await handleDelete(id);

        Swal.fire(
          'Excluído!',
          'Usuário foi excluído com sucesso.',
          'success'
        );
      }
    });
  };

  const handleEditTable = (id) => {
    handleEdit(id);
  }

  return (
    <Table striped bordered hover className="mt-3">
      <thead>
        <tr className='text-center'>
          <th>ID</th>
          <th>Nome</th>
          <th>Email</th>
          <th>Situação</th>
          <th>Data de Admissão</th>
          <th>Data e Hora (Cadastro)</th>
          <th>Data e Hora (Atualização)</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {tableData.length > 0 ? (
          tableData.map((data) => (
            <tr key={data.id}>
              <td>{data.id}</td>
              <td>{data.name}</td>
              <td>{data.email}</td>
              <td>{data.situation}</td>
              <td className='text-center'>{format(data.date_admission, 'dd/MM/yyyy')}</td>
              <td className='text-center'>{format(data.date_created, 'dd/MM/yyyy hh:mm')}</td>
              <td className='text-center'>{data.date_updated ? format(data.date_updated, 'dd/MM/yyyy hh:mm') : ''}</td>
              <td>
                <button className="btn btn-link " onClick={() => handleEditTable(data.id)}>
                  <BsFillPencilFill className='color-umentor' data-bs-toggle="alterar" data-bs-placement="bottom" title="Alterar" />
                </button>
                <button className="btn btn-link" onClick={() => confirmDelete(data.id)}>
                  <BsFillTrashFill color="#ff0800" />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center">
              Nenhum usuário cadastrado.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default DinamicTable;
