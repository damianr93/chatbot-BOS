import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';

const COLUMN_INDEX = 13; // Columna N (indice base 0)

export default function ExcelUploader({ onExtract }) {
    const handleFile = event => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const validExtensions = ['.xlsx', '.xls'];
        const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!validExtensions.includes(extension)) {
            alert('Seleccione un archivo Excel valido (.xlsx o .xls).');
            event.target.value = null;
            return;
        }

        const reader = new FileReader();

        reader.onload = evt => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                const phones = rows
                    .slice(1)
                    .map(row => row[COLUMN_INDEX])
                    .filter(cell => cell != null)
                    .map(String)
                    .map(str => str.replace(/\D/g, ''))
                    .map(str => str.replace(/^\+?54/, ''))
                    .map(str => str.replace(/^9/, ''))
                    .filter(str => str.length > 0);

                if (phones.length === 0) {
                    alert('No se encontraron numeros en la columna N.');
                }

                onExtract(phones);
            } catch (error) {
                console.error('Error al procesar el archivo Excel:', error);
                alert('Error al procesar el archivo. Verifique que sea un Excel valido.');
            }

            event.target.value = null;
        };

        reader.onerror = () => {
            alert('Error al leer el archivo.');
            event.target.value = null;
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="form-group">
            <label htmlFor="excelUpload">Cargar Excel (se procesan los numeros de la columna N):</label>
            <input
                id="excelUpload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFile}
                className="form-control"
            />
            <small className="form-text text-muted">
                El sistema extrae la columna N, limpia caracteres no numericos y elimina prefijos como +54 o 54.
            </small>
        </div>
    );
}

ExcelUploader.propTypes = {
    onExtract: PropTypes.func.isRequired
};
