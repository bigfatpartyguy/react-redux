/* eslint-disable no-shadow */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import {v4 as uuidv4} from 'uuid';
import {connect} from 'react-redux';
import {
  openDeleteModal,
  openEditModal,
  opendNewEntryModal,
} from 'features/openedModals';
import TableHeaderCell from '../TableHeaderCell';
import Button from '../Button';
import PaginationContainer from '../Pagination';
import DeleteModalContainer from '../Modals/DeleteModal';
import AddEditModal from '../Modals/AddEditModal/AddEditModal';
import {sortRows, getStudentById, getDateMask} from '../../features/helpers';
import styles from './Table.module.css';

const Table = props => {
  const {
    students,
    rowsPerPage,
    page,
    openedModals,
    studentId,
    sortFieldName,
    sortDirectionAsc,
    openDeleteModal,
  } = props;
  console.log(props);

  // const handleOpenDeleteModal = id => {
  //   this.setState(state => {
  //     const openedModals = {...state.openedModals};
  //     openedModals.delete = true;
  //     return {
  //       openedModals,
  //       studentId: id,
  //     };
  //   });
  // };

  const handleOpenAddModal = () => {
    this.setState(state => {
      const openedModals = {...state.openedModals};
      openedModals.add = true;
      return {
        openedModals,
      };
    });
  };

  const handleOpenEditModal = id => {
    this.setState(state => {
      const openedModals = {...state.openedModals};
      openedModals.edit = true;
      return {
        openedModals,
        studentId: id,
      };
    });
  };

  const handleSort = value => {
    this.setState(state => {
      let {sortFieldName, sortDirectionAsc} = state;
      if (sortFieldName === value) {
        sortDirectionAsc = !sortDirectionAsc;
      } else {
        sortFieldName = value;
        sortDirectionAsc = true;
      }
      const students = sortRows(
        state.students,
        sortFieldName,
        sortDirectionAsc
      );
      return {
        sortFieldName,
        sortDirectionAsc,
        students,
      };
    });
  };

  const renderTableRows = () => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageToDisplay = students
      .map(row => {
        const {id} = row;
        return (
          <tr key={id}>
            <td>{row.firstName}</td>
            <td>{row.secondName}</td>
            <td>{getDateMask(row.birthday)}</td>
            <td>{row.email}</td>
            <td>
              <Button
                text="Delete"
                onClick={() => openDeleteModal(id)}
                btnRole="danger"
              />
              <Button
                text="Edit"
                onClick={() => handleOpenEditModal(id)}
                btnRole="edit"
              />
            </td>
          </tr>
        );
      })
      .slice(start, end);
    const emptyRows = Array(rowsPerPage - pageToDisplay.length)
      .fill(null)
      .map((empty, ind) => {
        const key = ind;
        return (
          <tr key={key} className={styles.emptyRow}>
            <td colSpan="4">&nbsp;</td>
          </tr>
        );
      });

    return pageToDisplay.concat(emptyRows);
  };

  return (
    <div>
      <table className={styles.main}>
        <thead>
          <tr>
            <TableHeaderCell
              value="firstName"
              sortFieldName={sortFieldName}
              sortDirectionAsc={sortDirectionAsc}
              onClick={handleSort}>
              First Name
            </TableHeaderCell>
            <TableHeaderCell
              value="secondName"
              sortFieldName={sortFieldName}
              sortDirectionAsc={sortDirectionAsc}
              onClick={handleSort}>
              Second Name
            </TableHeaderCell>
            <TableHeaderCell
              value="birthday"
              sortFieldName={sortFieldName}
              sortDirectionAsc={sortDirectionAsc}
              onClick={handleSort}>
              Date of birth
            </TableHeaderCell>
            <TableHeaderCell
              value="email"
              sortFieldName={sortFieldName}
              sortDirectionAsc={sortDirectionAsc}
              onClick={handleSort}>
              Email
            </TableHeaderCell>
            <th>Controls</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
      <div className={styles.newEntryRow}>
        <Button
          text="Add new entry"
          btnRole="submit"
          onClick={handleOpenAddModal}
        />
      </div>
      <PaginationContainer selectOptions={[2, 4, 6]} />
      <DeleteModalContainer id={studentId} />
      <AddEditModal
        type={openedModals.add && 'add'}
        isOpen={openedModals.add || openedModals.edit}
        currentValues={openedModals.edit && getStudentById(students, studentId)}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  students: state.students,
  rowsPerPage: state.rowsPerPage,
  page: state.page,
  openedModals: state.openedModals,
  studentId: state.studentId,
  sortFieldName: state.sortFieldName,
  sortDirectionAsc: state.sortDirectionAsc,
});

const mapDispatchToProps = dispatch => ({
  openNewEntryModal: () => {},
  openEditModal: () => {},
  openDeleteModal: id => {
    console.log(id);
    dispatch(openDeleteModal());
  },
});

const TableContainer = connect(mapStateToProps, mapDispatchToProps)(Table);

export default TableContainer;
