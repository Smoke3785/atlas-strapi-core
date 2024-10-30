import React from 'react';

import { Flex, Tbody, Td, Tr } from '@strapi/design-system';
import { Typography } from '@atlas/design-system';
import {
  DynamicTable,
  onRowClick,
  pxToRem,
  RelativeTime,
  useQueryParams,
  useTracking,
} from '@strapi/helper-plugin';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import DeleteButton from './DeleteButton';
import ReadButton from './ReadButton';
import UpdateButton from './UpdateButton';

const Table = ({
  permissions,
  headers,
  contentType,
  isLoading,
  tokens,
  onConfirmDelete,
  tokenType,
}) => {
  const { canDelete, canUpdate, canRead } = permissions;

  /**
   * TODO: This needs refactoring to the new `Table` component.
   */
  return (
    <DynamicTable
      headers={headers}
      contentType={contentType}
      rows={tokens}
      withBulkActions={canDelete || canUpdate || canRead}
      isLoading={isLoading}
      onConfirmDelete={onConfirmDelete}
    >
      <TableRows
        tokenType={tokenType}
        permissions={permissions}
        onConfirmDelete={onConfirmDelete}
      />
    </DynamicTable>
  );
};

Table.propTypes = {
  tokens: PropTypes.array,
  permissions: PropTypes.shape({
    canRead: PropTypes.bool,
    canDelete: PropTypes.bool,
    canUpdate: PropTypes.bool,
  }).isRequired,
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      cellFormatter: PropTypes.func,
      key: PropTypes.string.isRequired,
      metadatas: PropTypes.shape({
        label: PropTypes.string.isRequired,
        sortable: PropTypes.bool,
      }).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  contentType: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  onConfirmDelete: PropTypes.func,
  tokenType: PropTypes.string.isRequired,
};

Table.defaultProps = {
  tokens: [],
  headers: [],
  isLoading: false,
  onConfirmDelete() {},
};

export default Table;

const TableRows = ({ tokenType, permissions, rows, withBulkActions, onConfirmDelete }) => {
  const { canDelete, canUpdate, canRead } = permissions;

  const [{ query }] = useQueryParams();
  const { formatMessage } = useIntl();
  const [, sortOrder] = query ? query.sort.split(':') : 'ASC';
  const {
    push,
    location: { pathname },
  } = useHistory();
  const { trackUsage } = useTracking();

  const sortedTokens = rows.sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);

    return sortOrder === 'DESC' ? -comparison : comparison;
  });

  return (
    <Tbody>
      {sortedTokens.map((token) => {
        return (
          <Tr
            key={token.id}
            {...onRowClick({
              fn() {
                trackUsage('willEditTokenFromList', {
                  tokenType,
                });
                push(`${pathname}/${token.id}`);
              },
              condition: canUpdate,
            })}
          >
            <Td maxWidth={pxToRem(250)}>
              <Typography textColor="neutral800" fontWeight="bold" ellipsis>
                {token.name}
              </Typography>
            </Td>
            <Td maxWidth={pxToRem(250)}>
              <Typography textColor="neutral800" ellipsis>
                {token.description}
              </Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">
                <RelativeTime timestamp={new Date(token.createdAt)} />
              </Typography>
            </Td>
            <Td>
              {token.lastUsedAt && (
                <Typography textColor="neutral800">
                  <RelativeTime
                    timestamp={new Date(token.lastUsedAt)}
                    customIntervals={[
                      {
                        unit: 'hours',
                        threshold: 1,
                        text: formatMessage({
                          id: 'Settings.apiTokens.lastHour',
                          defaultMessage: 'last hour',
                        }),
                      },
                    ]}
                  />
                </Typography>
              )}
            </Td>

            {withBulkActions && (
              <Td>
                <Flex justifyContent="end">
                  {canUpdate && <UpdateButton tokenName={token.name} tokenId={token.id} />}
                  {!canUpdate && canRead && (
                    <ReadButton tokenName={token.name} tokenId={token.id} />
                  )}
                  {canDelete && (
                    <DeleteButton
                      tokenName={token.name}
                      onClickDelete={() => onConfirmDelete(token.id)}
                      tokenType={tokenType}
                    />
                  )}
                </Flex>
              </Td>
            )}
          </Tr>
        );
      })}
    </Tbody>
  );
};

TableRows.defaultProps = {
  rows: [],
  withBulkActions: false,
};

TableRows.propTypes = {
  rows: PropTypes.array,
  permissions: PropTypes.shape({
    canRead: PropTypes.bool,
    canDelete: PropTypes.bool,
    canUpdate: PropTypes.bool,
  }).isRequired,
  onConfirmDelete: PropTypes.func.isRequired,
  tokenType: PropTypes.string.isRequired,
  withBulkActions: PropTypes.bool,
};
