import {describe, expect, it, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import {SearchForm} from "./SearchForm.jsx";


describe("SearchForm", () => {
    const searchFormProps = {
        searchTerm: "React",
        onSearchInput: vi.fn(),
        onSearchSubmit: vi.fn(),
    };

    it("renders the input field with its value", () => {
        render(<SearchForm {...searchFormProps} />);
        expect(screen.getByDisplayValue("React")).toBeInTheDocument();
    });

    it("renders the correct label", () => {
        render(<SearchForm {...searchFormProps}/>);
        expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
    });

    it("calls onSearchInput on input field change", () => {
        render(<SearchForm {...searchFormProps} />);
        fireEvent.change(screen.getByDisplayValue("React"), {
            target: { value: "Redux" },
        });
        expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    })

    it("calls onSearchSubmit on button submit click", () => {
        render(<SearchForm {...searchFormProps} />);
        fireEvent.submit(screen.getByRole("button"));
        expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    });
});
