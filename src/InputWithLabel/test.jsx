import {describe, expect, it, vi} from "vitest";
import {fireEvent, render, screen} from "@testing-library/react";
import {InputWithLabel} from "./InputWithLabel.jsx";


describe("InputWithLabel", () => {
    const props = {
        id: "search",
        value: "React",
        type: "text",
        onInputChange: vi.fn(),
        isFocused: false,
        children: <strong>Search</strong>,
    }

    it("renders children", () => {
        render(<InputWithLabel {...props}/>);
        expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
    });

    it("input has the correct properties", () => {
        render(<InputWithLabel {...props}/>);
        const textbox = screen.getByRole("textbox");
        expect(textbox).toHaveAttribute("id", "search");
        expect(textbox).toHaveAttribute("type", "text");
        expect(textbox).toHaveAttribute("value", "React");
    });

    it("calls onInputChange on input field change", () => {
        render(<InputWithLabel {...props}/>);
        fireEvent.change(screen.getByDisplayValue("React"), {
            target: { value: "Redux" },
        });
        expect(props.onInputChange).toHaveBeenCalledTimes(1);
    });
});
